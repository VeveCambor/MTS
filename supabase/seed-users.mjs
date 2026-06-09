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

async function main() {
  const trainerId = await upsertUser(TRAINER, null);
  for (const t of TRAINEES) await upsertUser(t, trainerId);
  console.log("Hotovo. Trenér: pepa@mts.test / pepa1234");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
