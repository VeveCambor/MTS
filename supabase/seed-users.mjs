// Založení testovacích uživatelů přes Supabase Admin API.
// Spuštění:  node supabase/seed-users.mjs
// Vyžaduje v .env.local: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";

function loadEnv() {
  try {
    const raw = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  } catch {
    // .env.local nemusí existovat – spoléháme na proces. env
  }
}

loadEnv();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("Chybí NEXT_PUBLIC_SUPABASE_URL nebo SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

const admin = createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });

const TRAINER = {
  email: "pepa@mts.test",
  password: "pepa1234",
  meta: { nick: "pepa", first_name: "Pepa", last_name: "Trenér", role: 20 },
};

const TRAINEES = [
  { email: "honza@mts.test", password: "honza1234", meta: { nick: "honza", first_name: "Honza", last_name: "Cvičenec", role: 1 } },
  { email: "lucie@mts.test", password: "lucie1234", meta: { nick: "lucie", first_name: "Lucie", last_name: "Cvičenka", role: 1 } },
];

async function upsertUser(def, trainerId) {
  const { data: created, error } = await admin.auth.admin.createUser({
    email: def.email,
    password: def.password,
    email_confirm: true,
    user_metadata: def.meta,
  });

  let userId = created?.user?.id;

  if (error) {
    if (!/already/i.test(error.message)) throw error;
    const { data: list } = await admin.auth.admin.listUsers({ perPage: 1000 });
    userId = list.users.find((u) => u.email === def.email)?.id;
    console.log(`= ${def.email} už existuje`);
  } else {
    console.log(`+ vytvořen ${def.email}`);
  }

  if (!userId) throw new Error(`Nelze získat id pro ${def.email}`);

  const patch = { role: def.meta.role, trainer_id: trainerId ?? null };
  const { error: upErr } = await admin.from("profiles").update(patch).eq("id", userId);
  if (upErr) throw upErr;

  return userId;
}

// --- Globální katalog (sjednocení dle POPIS_DESIGN_A_DATA.md) -------------

const CATALOG_ACTIVITIES = [
  { name: "Běhání", description: "Běh", icon: "run" },
  { name: "Plavání", description: "Plavání", icon: "swim" },
  { name: "Jízda na kole", description: "Cyklistika", icon: "bike" },
  { name: "Silový tréning", description: "Silový tréning", icon: "gym" },
  { name: "Chůze", description: "Chůze", icon: "walk" },
  { name: "Jóga", description: "Jóga", icon: "yoga" },
  { name: "SM systém", description: "SM systém", icon: "smsystem" },
  { name: "Běžky", description: "Běžky", icon: "skiing" },
];

const CATALOG_UNITS = [
  { name: "km", description: "Kilometer" },
  { name: "m", description: "Metr" },
  { name: "h", description: "Hodina" },
  { name: "min", description: "Minuta" },
  { name: "s", description: "Sekunda" },
];

const CATALOG_PARAM_TYPES = [
  { name: "Rychlost", description: "Rychlost" },
  { name: "Tepy", description: "Tepová frekvence" },
  { name: "Tempo", description: "Tempo běhu" },
];

async function ensureCatalogTable(table, desired, hasIcon) {
  const { data: existing, error } = await admin.from(table).select("name");
  if (error) throw error;
  const existingNames = new Set((existing ?? []).map((r) => r.name));

  const toInsert = desired.filter((d) => !existingNames.has(d.name));
  if (toInsert.length) {
    const { error: insErr } = await admin.from(table).insert(toInsert);
    if (insErr) throw insErr;
  }

  // Aktualizuj ikonu/popis u sportů, ať sedí s designem
  if (hasIcon) {
    for (const d of desired) {
      await admin.from(table).update({ icon: d.icon, description: d.description }).eq("name", d.name);
    }
  }

  // Odeber zastaralé položky (best-effort – přeskoč, pokud jsou navázané)
  const desiredNames = desired.map((d) => d.name);
  const obsolete = (existing ?? []).map((r) => r.name).filter((n) => !desiredNames.includes(n));
  for (const name of obsolete) {
    const { error: delErr } = await admin.from(table).delete().eq("name", name);
    if (delErr) console.warn(`! ${table}: nelze smazat "${name}" (navázaná data) – ponechávám`);
  }
}

async function ensureCatalog() {
  await ensureCatalogTable("activities", CATALOG_ACTIVITIES, true);
  await ensureCatalogTable("activity_training_param_units", CATALOG_UNITS, false);
  await ensureCatalogTable("parameter_types", CATALOG_PARAM_TYPES, false);
  console.log("+ katalog sjednocen (8 sportů, jednotky, typy parametrů)");
}

// --- Doménová data trenéra (dle POPIS_DESIGN_A_DATA.md) -------------------

async function fetchCatalog() {
  const [acts, ptypes, units] = await Promise.all([
    admin.from("activities").select("id,name"),
    admin.from("parameter_types").select("id,name"),
    admin.from("activity_training_param_units").select("id,name"),
  ]);
  for (const r of [acts, ptypes, units]) if (r.error) throw r.error;
  const byName = (rows) => (n) => {
    const found = rows.find((x) => x.name === n);
    if (!found) throw new Error(`Katalog: chybí "${n}". Spusť nejdřív seed.sql.`);
    return found.id;
  };
  return {
    actId: byName(acts.data),
    ptId: byName(ptypes.data),
    unitId: byName(units.data),
  };
}

async function cleanTrainerData(trainerId) {
  // Pořadí respektuje FK (atpa cascade z trainings; aktuální hodnoty drží trainer_parameters)
  await admin.from("training_plans").delete().eq("trainer_id", trainerId);
  await admin.from("activity_groups").delete().eq("user_id", trainerId);
  await admin.from("actual_user_parameters").delete().eq("trainer_id", trainerId);
  await admin.from("history_user_parameters").delete().eq("trainer_id", trainerId);
  await admin.from("trainer_parameters").delete().eq("user_id", trainerId);
  await admin.from("trainer_activity_enable").delete().eq("user_id", trainerId);
}

async function insertReturning(table, rows, columns = "id,name") {
  const { data, error } = await admin.from(table).insert(rows).select(columns);
  if (error) throw error;
  return data;
}

async function seedTrainerData(trainerId, traineeIds) {
  const { actId, ptId, unitId } = await fetchCatalog();
  await cleanTrainerData(trainerId);

  // Povolené aktivity trenéra – všechny
  const allActs = (await admin.from("activities").select("id")).data ?? [];
  await admin
    .from("trainer_activity_enable")
    .insert(allActs.map((a) => ({ user_id: trainerId, activity_id: a.id })));

  const run = actId("Běhání");
  const bike = actId("Jízda na kole");

  // Trenérské parametry
  const params = await insertReturning("trainer_parameters", [
    { user_id: trainerId, activity_id: run, parameter_type_id: ptId("Tepy"), name: "Tepová frekvence nízko", description: "Tepová frekvence nízko pro běh" },
    { user_id: trainerId, activity_id: run, parameter_type_id: ptId("Tepy"), name: "Tepová frekvence středně", description: "Tepová frekvence střední pro běh" },
    { user_id: trainerId, activity_id: run, parameter_type_id: ptId("Tepy"), name: "Tepová frekvence vysoko", description: "Tepová frekvence vysoká pro běh" },
    { user_id: trainerId, activity_id: run, parameter_type_id: ptId("Tempo"), name: "Tempo pomalé", description: "Tempo pomalé pro běh" },
    { user_id: trainerId, activity_id: run, parameter_type_id: ptId("Tempo"), name: "Tempo střední", description: "Tempo střední pro běh" },
    { user_id: trainerId, activity_id: run, parameter_type_id: ptId("Tempo"), name: "Tempo rychlé", description: "Tempo rychlé pro běh" },
    { user_id: trainerId, activity_id: bike, parameter_type_id: ptId("Rychlost"), name: "Rychlost nízko", description: "Rychlost nízko pro kolo" },
    { user_id: trainerId, activity_id: bike, parameter_type_id: ptId("Rychlost"), name: "Rychlost středně", description: "Rychlost střední pro kolo" },
    { user_id: trainerId, activity_id: bike, parameter_type_id: ptId("Rychlost"), name: "Rychlost vysoko", description: "Rychlost vysoká pro kolo" },
  ]);
  const tpId = (n) => params.find((p) => p.name === n).id;

  // Skupiny (běh)
  const groups = await insertReturning("activity_groups", [
    { activity_id: run, user_id: trainerId, name: "BZ", description: "Běh základní" },
    { activity_id: run, user_id: trainerId, name: "BR", description: "Běh rychlostní" },
  ]);
  const grpId = (n) => groups.find((g) => g.name === n).id;

  // Tréninkové jednotky
  const trainings = await insertReturning("activity_trainings", [
    { activity_group_id: grpId("BZ"), user_id: trainerId, name: "BZ1", description: "Běh základní 1" },
    { activity_group_id: grpId("BZ"), user_id: trainerId, name: "BZ2", description: "Běh základní 2" },
    { activity_group_id: grpId("BZ"), user_id: trainerId, name: "BZ3", description: "Běh základní 3" },
    { activity_group_id: grpId("BR"), user_id: trainerId, name: "BR1", description: "Běh rychlostní 1" },
    { activity_group_id: grpId("BR"), user_id: trainerId, name: "BR2", description: "Běh rychlostní 2" },
    { activity_group_id: grpId("BR"), user_id: trainerId, name: "BR3", description: "Běh rychlostní 3" },
  ]);
  const trId = (n) => trainings.find((t) => t.name === n).id;

  // Přiřazení parametrů k jednotkám (délka + parametr + jednotka, value_text='min' = MinLength)
  const km = unitId("km");
  const min = unitId("min");
  const atpa = [];
  const assign = (training, paramName, value, unit, isMin) =>
    atpa.push({
      activity_training_id: trId(training),
      trainer_parameter_id: tpId(paramName),
      length_unit_id: unit,
      value,
      value_text: isMin ? "min" : null,
    });
  assign("BZ1", "Tepová frekvence nízko", 20, km, false);
  assign("BZ1", "Tempo pomalé", 20, km, false);
  assign("BZ2", "Tepová frekvence nízko", 10, km, false);
  assign("BZ2", "Tepová frekvence středně", 20, km, false);
  assign("BZ2", "Tempo střední", 10, km, false);
  assign("BZ3", "Tepová frekvence nízko", 10, min, true);
  assign("BZ3", "Tepová frekvence středně", 20, km, false);
  assign("BZ3", "Tepová frekvence nízko", 10, min, true);
  assign("BR1", "Tepová frekvence vysoko", 10, min, true);
  assign("BR1", "Tempo rychlé", 5, km, false);
  assign("BR2", "Tepová frekvence vysoko", 20, min, true);
  assign("BR3", "Tepová frekvence vysoko", 30, min, true);
  const { error: atpaErr } = await admin.from("activity_training_parameters_assign").insert(atpa);
  if (atpaErr) throw atpaErr;

  // Aktuální hodnoty parametrů cvičenců (rozsahy)
  const ranges = [
    ["Tepová frekvence nízko", "90-110"],
    ["Tepová frekvence středně", "110-150"],
    ["Tepová frekvence vysoko", "150-200"],
    ["Tempo pomalé", "6-7"],
    ["Tempo střední", "5-6"],
    ["Tempo rychlé", "4-5"],
  ];
  const aup = [];
  for (const uid of traineeIds)
    for (const [name, value] of ranges)
      aup.push({ user_id: uid, trainer_id: trainerId, trainer_parameter_id: tpId(name), value });
  if (aup.length) {
    const { error: aupErr } = await admin.from("actual_user_parameters").insert(aup);
    if (aupErr) throw aupErr;
  }

  // Ukázková šablona plánu
  const { data: plan, error: planErr } = await admin
    .from("training_plans")
    .insert({
      trainer_id: trainerId,
      name: "Tréninkový plán pro běh",
      description: "Tento plán je zaměřen na zlepšení běžeckých výkonů.",
      cycle_length: 7,
      number_of_cycles: 4,
      enabled: true,
    })
    .select("id")
    .single();
  if (planErr) throw planErr;

  await admin.from("training_plan_week_definitions").insert([
    { training_plan_id: plan.id, autonum_cycle: 1, expected_km: 20, description: "První týden tréninkového plánu" },
    { training_plan_id: plan.id, autonum_cycle: 2, expected_km: 30, description: "Druhý týden tréninkového plánu" },
    { training_plan_id: plan.id, autonum_cycle: 3, expected_km: null, description: "Třetí týden tréninkového plánu" },
    { training_plan_id: plan.id, autonum_cycle: 4, expected_km: null, description: "Čtvrtý týden tréninkového plánu" },
  ]);

  await admin.from("training_plan_activity_training_assigns").insert([
    { training_plan_id: plan.id, activity_training_id: trId("BZ1"), autonum_cycle: 1, autonum_in_cycle: 1, order_in_cycle: 1, name: "BZ1", description: "Pondělní trénink" },
    { training_plan_id: plan.id, activity_training_id: trId("BZ2"), autonum_cycle: 1, autonum_in_cycle: 3, order_in_cycle: 1, name: "BZ2", description: "Středeční trénink" },
    { training_plan_id: plan.id, activity_training_id: trId("BZ3"), autonum_cycle: 2, autonum_in_cycle: 1, order_in_cycle: 1, name: "BZ3", description: "Pondělní trénink" },
  ]);

  console.log("+ naseedována trenérská data (skupiny, jednotky, parametry, hodnoty, šablona)");
}

async function main() {
  const trainerId = await upsertUser(TRAINER, null);
  const traineeIds = [];
  for (const t of TRAINEES) traineeIds.push(await upsertUser(t, trainerId));
  await ensureCatalog();
  await seedTrainerData(trainerId, traineeIds);
  console.log("Hotovo. Trenér: pepa@mts.test / pepa1234");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
