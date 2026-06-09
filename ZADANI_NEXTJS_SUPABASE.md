# MyTrainingSpace (MTS) — Zadání pro kopii projektu v Next.js + Supabase

> **Účel dokumentu:** Podrobné zadání pro samostatný vývoj nové verze aplikace MyTrainingSpace.  
> **Zdrojové projekty:**
> - Frontend: `MTS.FE/mts-fe` (React 18 + Vite + Redux + MUI)
> - Backend + DB: `mpa/MTS.TestProject` (ASP.NET Core 8 + SQL Server)
>
> **Cíl:** Nový repozitář s Next.js (App Router) a Supabase (PostgreSQL + Auth + RLS).

---

## Obsah

1. [Přehled produktu](#1-přehled-produktu)
2. [Současný stav](#2-současný-stav)
3. [Cílový stack](#3-cílový-stack)
4. [Struktura nového projektu](#4-struktura-nového-projektu)
5. [Databázové schéma (Supabase)](#5-databázové-schéma-supabase)
6. [Autentizace a role](#6-autentizace-a-role)
7. [Row Level Security (RLS)](#7-row-level-security-rls)
8. [Mapování API → Supabase](#8-mapování-api--supabase)
9. [Frontend — stránky a routy](#9-frontend--stránky-a-routy)
10. [Frontend — komponenty a konvence](#10-frontend--komponenty-a-konvence)
11. [Klíčová business logika](#11-klíčová-business-logika)
12. [Fázový plán implementace](#12-fázový-plán-implementace)
13. [Environment proměnné](#13-environment-proměnné)
14. [Známé problémy a rozhodnutí](#14-známé-problémy-a-rozhodnutí)
15. [Co zatím není hotové ve zdrojovém projektu](#15-co-zatím-není-hotové-ve-zdrojovém-projektu)
16. [Referenční soubory](#16-referenční-soubory)
17. [Akceptační kritéria](#17-akceptační-kritéria)

---

## 1. Přehled produktu

**MyTrainingSpace** je webová aplikace pro správu tréninků mezi **trenérem** a **cvičenci**.

### Hlavní doménové koncepty

| Koncept | Popis |
|---------|-------|
| **Aktivita (sport)** | Globální katalog sportů (běh, cyklistika, plavání…) |
| **Skupina tréninků** | Trenérská kategorie uvnitř sportu (např. „Vytrvalost“, „BZ“) |
| **Tréninková jednotka** | Konkrétní jednotka ve skupině (např. „Běh 10 km easy“) |
| **Parametr** | Trenérská definice měřitelné veličiny (tepy, tempo, délka…) |
| **Šablona plánu** | Tréninkový plán vytvořený trenérem bez přiřazení cvičenci |
| **Přiřazený plán** | Kopie šablony (nebo nový plán) pro konkrétního cvičence s datem začátku |
| **Tréninkový deník** | Poznámky cvičence k jednotlivým tréninkům v kalendáři |

### Hierarchie dat

```
Activity (sport)
  └── ActivityGroup (skupina, vlastník = trenér)
        └── ActivityTraining (jednotka)
              └── ActivityTrainingParametersAssign (km, čas, HR zóna…)

TrainingPlan (šablona trenéra)
  └── TrainingPlanWeekDefinition (týden: km, čas, popis)
        └── TrainingPlanActivityTrainingAssign (den v týdnu → jednotka)

TrainingPlanUserAssign (přiřazený plán cvičenci)
  └── TrainingPlanUserAssignWeekDefinition
        └── TrainingPlanUserAssignActivityTrainingAssign
              └── TrainingDiaryNote (poznámka cvičence)
```

### Uživatelské role

| Role | Hodnota (BE) | FE enum | Oprávnění |
|------|--------------|---------|-----------|
| Unverified | 0 | `Unverified` | Základní, po registraci |
| User (cvičenec) | 1 | `User` | Vlastní plány, kalendář, deník |
| SubscriptionUser | 2 | `SubscriptionUser` | Jako User + předplatné |
| Trainer | 20 | `Trainer` | Šablony, sportovci, CRUD tréninků |
| SubscriptionTrainer | 21 | `SubscriptionTrainer` | Jako Trainer + předplatné |
| Admin | **1000** | ~~99~~ (bug ve FE) | Superuser |

> **Poznámka:** Frontend mapuje Admin jako `99`, backend používá `1000`. V novém projektu sjednotit na `1000`.

---

## 2. Současný stav

### Frontend (`MTS.FE/mts-fe`)

| Oblast | Technologie |
|--------|-------------|
| Build | Vite 5 |
| Framework | React 18 |
| Routing | react-router-dom v6 |
| State | Redux Toolkit (5 slice) |
| UI | MUI v5 + styled-components + Emotion |
| API | Nativní `fetch()`, base URL hardcoded |
| Auth | JWT v `localStorage`, header `Authorization: Bearer` |
| Formuláře | react-hook-form (login), Formik + Yup (tabulky) |
| Kalendář | react-big-calendar + date-fns |
| PDF | jspdf + html2canvas |

**Nepoužité závislosti:** `axios`, `react-query`, `jwt-decode`

### Backend (`mpa/MTS.TestProject`)

| Oblast | Technologie |
|--------|-------------|
| Framework | ASP.NET Core 8 Web API |
| ORM | Entity Framework Core 8 |
| DB | SQL Server 2022 (Docker) |
| Auth | Vlastní JWT + tabulka `TOKEN` |
| Port | `http://localhost:3001` |

**Schéma DB:** Restore z `mpa/DB/MTS.bak` — **neexistují EF migrace**. Mapování entit je v `MtsContext.cs`.

### Vztah projektů

```
MTS.FE (Vite SPA)  ──HTTP REST──►  mpa (ASP.NET API)  ──►  SQL Server (MTS)
```

Nový projekt tento řetězec nahradí:

```
Next.js App  ──►  Supabase Client  ──►  PostgreSQL (Supabase)
                     └── Auth (Supabase Auth)
                     └── RLS policies
                     └── RPC / Edge Functions (složitá logika)
```

---

## 3. Cílový stack

### Povinné

| Oblast | Technologie | Verze (doporučení) |
|--------|-------------|-------------------|
| Framework | Next.js (App Router) | 15.x |
| Jazyk | TypeScript | 5.x |
| DB + Auth | Supabase | aktuální |
| Supabase client | `@supabase/supabase-js` + `@supabase/ssr` | aktuální |
| UI | MUI v5 nebo v6 | zachovat konzistenci se zdrojem |
| Styling | styled-components (nebo MUI-only) | |
| Datum | date-fns | 3.x |
| Kalendář | react-big-calendar | |
| PDF export | jspdf + html2canvas | |

### Doporučené změny oproti zdroji

| Zdroj | Cíl | Důvod |
|-------|-----|-------|
| Redux Toolkit | TanStack Query + React Context (UI stav) | Server state lépe přes Query; méně boilerplate |
| react-router-dom | Next.js file-based routing | Nativní pro Next.js |
| localStorage JWT | Supabase SSR cookies | Bezpečnější session |
| Rozptýlené `fetch()` | Centralizovaný Supabase service layer | Jednotná datová vrstva |
| Formik + react-hook-form | Jedna knihovna (doporučeno react-hook-form + zod) | Konzistence |

### Volitelné

- Supabase Realtime pro live aktualizace kalendáře
- Supabase Storage pro avatary
- Vercel pro deployment

---

## 4. Struktura nového projektu

```
mts-next/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (app)/
│   │   ├── layout.tsx              # Navbar + Sidebar + Footer
│   │   ├── dashboard/page.tsx
│   │   ├── trainees/page.tsx
│   │   ├── calendar/page.tsx
│   │   ├── profile/page.tsx
│   │   ├── settings/page.tsx
│   │   ├── my-training-plan/page.tsx
│   │   ├── my-progress/page.tsx
│   │   └── templates/
│   │       ├── training-sport/page.tsx
│   │       ├── parametr-sport/page.tsx
│   │       ├── training-plan/page.tsx
│   │       ├── training-report/page.tsx
│   │       ├── parametr-report/[[...activityId]]/page.tsx
│   │       └── sport/[sport]/page.tsx
│   ├── layout.tsx
│   └── page.tsx                      # redirect → /login nebo /dashboard
├── components/
│   ├── ui/                           # Space* komponenty
│   ├── layout/                       # Navbar, Sidebar, Footer
│   ├── calendar/
│   ├── forms/
│   └── tables/
├── lib/
│   ├── supabase/
│   │   ├── client.ts                 # browser client
│   │   ├── server.ts                 # server client (SSR)
│   │   └── middleware.ts
│   └── services/                     # datová vrstva (nahrazuje api.ts)
│       ├── users.ts
│       ├── activities.ts
│       ├── parameters.ts
│       ├── training-plans.ts
│       └── training-diary.ts
├── hooks/
├── types/
│   └── trainingTypes.ts              # přenést a upravit ze zdroje
├── styles/
│   └── theme.ts
├── supabase/
│   ├── migrations/                   # SQL migrace
│   └── seed.sql                      # seed data (trenér pepa, aktivity…)
├── middleware.ts                     # auth guard
├── .env.local
└── package.json
```

### Inicializace projektu

```bash
npx create-next-app@latest mts-next --typescript --app --src-dir=false
cd mts-next
npm install @supabase/supabase-js @supabase/ssr
npm install @mui/material @emotion/react @emotion/styled styled-components
npm install @tanstack/react-query date-fns react-big-calendar react-hook-form zod
npm install jspdf html2canvas react-feather react-icons
npx supabase init
```

---

## 5. Databázové schéma (Supabase)

### Konvence pojmenování

- SQL Server `UPPER_SNAKE_CASE` → PostgreSQL `snake_case`
- `uniqueidentifier` → `uuid` (většinou `gen_random_uuid()` nebo zachovat původní GUID při migraci dat)
- `datetime` → `timestamptz`
- `nvarchar` → `text`
- Tabulka `USER` → `profiles` (navázaná na `auth.users`)

### Tabulky k vytvoření

#### `profiles` (rozšíření Supabase Auth)

```sql
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nick text not null unique,
  email text not null,
  first_name text,
  last_name text,
  role smallint not null default 0,
  trainer_id uuid references profiles(id),
  is_user_trainer boolean default false,
  date_of_birth date,
  avatar smallint,          -- index emoji avataru (0–7)
  bio text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

**Mapování ze `USER` tabulky:**
- `UserId` → `id`
- `Nick` → `nick`
- `Name` → `first_name`
- `Surename` → `last_name`
- `Role` → `role`
- `Trainer` → `trainer_id`
- `Password` → **NEPŘENÁŠET** (Supabase Auth)

#### `activities` (globální sporty)

```sql
create table activities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  icon text
);
```

#### `activity_groups`

```sql
create table activity_groups (
  id uuid primary key default gen_random_uuid(),
  activity_id uuid not null references activities(id),
  user_id uuid not null references profiles(id),  -- trenér-vlastník
  name text not null,
  description text
);
```

#### `activity_trainings` (jednotky)

```sql
create table activity_trainings (
  id uuid primary key default gen_random_uuid(),
  activity_group_id uuid not null references activity_groups(id) on delete cascade,
  user_id uuid not null references profiles(id),
  name text not null,
  description text
);
```

#### `activity_training_param_units` (jednotky délky/času)

```sql
create table activity_training_param_units (
  id uuid primary key default gen_random_uuid(),
  name text not null,       -- km, m, h, min, s
  description text
);
```

#### `parameter_types`

```sql
create table parameter_types (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text
);
```

#### `trainer_parameters`

```sql
create table trainer_parameters (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id),
  activity_id uuid not null references activities(id),
  parameter_type_id uuid not null references parameter_types(id),
  name text not null,
  description text
);
```

#### `activity_training_parameters_assign`

```sql
create table activity_training_parameters_assign (
  id uuid primary key default gen_random_uuid(),
  activity_training_id uuid not null references activity_trainings(id) on delete cascade,
  trainer_parameter_id uuid not null references trainer_parameters(id),
  length_unit_id uuid references activity_training_param_units(id),
  value numeric,
  value_text text
);
```

#### `actual_user_parameters` (aktuální hodnoty parametrů cvičence)

```sql
create table actual_user_parameters (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id),
  trainer_id uuid not null references profiles(id),
  trainer_parameter_id uuid not null references trainer_parameters(id),
  value text,
  recorded_at timestamptz default now()
);
```

#### `history_user_parameters`

```sql
create table history_user_parameters (
  trainer_parameter_id uuid not null references trainer_parameters(id),
  user_id uuid not null references profiles(id),
  trainer_id uuid not null references profiles(id),
  date_time_from timestamptz not null,
  date_time_to timestamptz not null,
  value text,
  primary key (trainer_parameter_id, user_id, trainer_id, date_time_from, date_time_to)
);
```

#### `trainer_activity_enable` (oblíbené aktivity trenéra)

```sql
create table trainer_activity_enable (
  user_id uuid not null references profiles(id),
  activity_id uuid not null references activities(id),
  primary key (user_id, activity_id)
);
```

#### `training_plans` (šablony)

```sql
create table training_plans (
  id uuid primary key default gen_random_uuid(),
  trainer_id uuid not null references profiles(id),
  name text not null,
  description text,
  cycle_length smallint not null,    -- počet dní v cyklu (týden = 7)
  number_of_cycles smallint not null,
  enabled boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

#### `training_plan_week_definitions`

```sql
create table training_plan_week_definitions (
  id uuid primary key default gen_random_uuid(),
  training_plan_id uuid not null references training_plans(id) on delete cascade,
  autonum_cycle smallint not null,
  expected_km numeric,
  expected_time interval,
  description text
);
```

#### `training_plan_activity_training_assigns`

```sql
create table training_plan_activity_training_assigns (
  id uuid primary key default gen_random_uuid(),
  training_plan_id uuid not null references training_plans(id) on delete cascade,
  activity_training_id uuid references activity_trainings(id),
  autonum_cycle smallint not null,
  autonum_in_cycle smallint not null,   -- den v cyklu (1–7)
  order_in_cycle smallint,
  name text,
  description text
);
```

#### `training_plan_user_assigns` (přiřazené plány)

```sql
create table training_plan_user_assigns (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id),       -- cvičenec
  trainer_id uuid not null references profiles(id),
  name text not null,
  description text,
  cycle_length smallint not null,
  number_of_cycles smallint not null,
  enabled boolean default true,
  date_time_start timestamptz not null,
  source_template_id uuid references training_plans(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

#### `training_plan_user_assign_week_definitions`

```sql
create table training_plan_user_assign_week_definitions (
  id uuid primary key default gen_random_uuid(),
  assign_id uuid not null references training_plan_user_assigns(id) on delete cascade,
  autonum_cycle smallint not null,
  expected_km numeric,
  expected_time interval,
  description text
);
```

#### `training_plan_user_assign_activity_training_assigns`

```sql
create table training_plan_user_assign_activity_training_assigns (
  id uuid primary key default gen_random_uuid(),
  assign_id uuid not null references training_plan_user_assigns(id) on delete cascade,
  activity_training_id uuid references activity_trainings(id),
  autonum_cycle smallint not null,
  autonum_in_cycle smallint not null,
  order_in_cycle smallint,
  name text,
  description text
);
```

#### `training_diary_notes`

```sql
create table training_diary_notes (
  id uuid primary key default gen_random_uuid(),
  assign_activity_id uuid not null
    references training_plan_user_assign_activity_training_assigns(id) on delete cascade,
  user_id uuid not null references profiles(id),
  note text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

#### Tabulky s nižší prioritou (existují ve schématu, nemají API)

- `teams` + `user_team_assigned` — rozhodnout, zda implementovat
- `logs` — volitelné pro audit

#### Tabulky k odstranění

- `TOKEN` — nahrazeno Supabase Auth
- `ROLE` lookup — role jako sloupec v `profiles`

### Seed data

Přenést logiku z `mpa/MTS.TestProject/MTS.TestProject/DB/Repository.cs`:

| Entita | Hodnoty |
|--------|---------|
| Trenér | nick: `pepa`, heslo: `pepa`, role: 20 |
| Cvičenci | několik testovacích uživatelů pod trenérem pepa |
| Aktivity | běh, cyklistika, plavání, triatlon… |
| Ukázkové skupiny a jednotky | per aktivita |
| Ukázková šablona plánu | s týdny a aktivitami |

---

## 6. Autentizace a role

### Registrace

1. Uživatel vyplní formulář (nick, email, heslo, jméno, příjmení)
2. `supabase.auth.signUp({ email, password })`
3. Trigger `on_auth_user_created` vytvoří záznam v `profiles` s `role = 0` (Unverified)
4. Admin/trenér může změnit roli

### Přihlášení

1. `supabase.auth.signInWithPassword({ email, password })`
2. Načíst `profiles` podle `auth.uid()`
3. Session v cookies přes `@supabase/ssr`

### Middleware (`middleware.ts`)

```typescript
// Pseudokód — chráněné routy
const protectedPaths = ['/dashboard', '/trainees', '/calendar', ...];
if (protectedPaths.some(p => pathname.startsWith(p)) && !session) {
  redirect('/login');
}
```

### Role-based routing (sidebar)

| Role | Viditelné položky menu |
|------|------------------------|
| Trainer / SubscriptionTrainer | Dashboard, Šablony (Skupiny/Parametry/Plán), Sportovci, Kalendář, Nastavení |
| User / SubscriptionUser | Dashboard, Můj plán, Pokrok, Kalendář, Nastavení |

### Helper funkce (přenést z `useAuth.ts` / `useUserRole`)

```typescript
const TRAINER_ROLES = [20, 21];
const TRAINEE_ROLES = [1, 2];
const isTrainer = (role: number) => TRAINER_ROLES.includes(role);
const isTrainee = (role: number) => TRAINEE_ROLES.includes(role);
```

---

## 7. Row Level Security (RLS)

Všechny tabulky musí mít zapnuté RLS. Příklady politik:

### `profiles`

```sql
-- Uživatel vidí svůj profil
create policy "Users can view own profile"
  on profiles for select using (auth.uid() = id);

-- Trenér vidí své cvičence
create policy "Trainers can view trainees"
  on profiles for select using (
    trainer_id = auth.uid()
    or id = auth.uid()
  );

-- Uživatel může upravit svůj profil
create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);
```

### `activity_groups`, `activity_trainings`, `trainer_parameters`

```sql
-- Trenér vidí a spravuje jen své záznamy
create policy "Trainer owns groups"
  on activity_groups for all using (user_id = auth.uid());
```

### `training_plans` (šablony)

```sql
create policy "Trainer owns templates"
  on training_plans for all using (trainer_id = auth.uid());
```

### `training_plan_user_assigns` (přiřazené plány)

```sql
-- Trenér vidí plány svých cvičenců
create policy "Trainer sees assigned plans"
  on training_plan_user_assigns for select using (trainer_id = auth.uid());

-- Cvičenec vidí své plány
create policy "Trainee sees own plans"
  on training_plan_user_assigns for select using (user_id = auth.uid());
```

### `training_diary_notes`

```sql
-- Cvičenec spravuje své poznámky
create policy "Trainee manages own notes"
  on training_diary_notes for all using (user_id = auth.uid());

-- Trenér čte poznámky svých cvičenců
create policy "Trainer reads trainee notes"
  on training_diary_notes for select using (
    exists (
      select 1 from profiles p
      where p.id = training_diary_notes.user_id
        and p.trainer_id = auth.uid()
    )
  );
```

### `activities` (globální katalog)

```sql
create policy "Everyone can read activities"
  on activities for select using (true);
```

---

## 8. Mapování API → Supabase

Původní API base: `http://localhost:3001/api`  
Definice endpointů: `mts-fe/src/api/api.ts`

### User

| Původní endpoint | Supabase ekvivalent |
|------------------|---------------------|
| `POST /User/login` | `supabase.auth.signInWithPassword()` |
| `POST /User/registration` | `supabase.auth.signUp()` + trigger na `profiles` |
| `GET /User/logout` | `supabase.auth.signOut()` |
| `GET /User/GetCurrentUser` | `select * from profiles where id = auth.uid()` |
| `GET /User/GetAllMyUsers` | `select * from profiles where trainer_id = auth.uid()` |

### Activity

| Původní endpoint | Supabase ekvivalent |
|------------------|---------------------|
| `GET /Activity/getAllActivities` | `select * from activities` |
| `GET /Activity/GetAllMyActivities` | join `trainer_activity_enable` |
| `PUT /Activity/UpdateMyActivities` | upsert do `trainer_activity_enable` |
| `GET /Activity/GetAllActivitiesForTrainingPlan` | select s join na skupiny trenéra |

### ActivityGroups + Units

| Původní endpoint | Supabase ekvivalent |
|------------------|---------------------|
| `GET .../GetMyGroupsForActivity/{id}` | `select * from activity_groups where activity_id = $1 and user_id = auth.uid()` |
| `POST .../AddMyGroupForActivity` | `insert into activity_groups` |
| `PUT .../UpdateMyGroupForActivity` | `update activity_groups` |
| `DELETE .../DeleteMyGroupForActivity/{id}` | `delete from activity_groups` |
| `GET .../GetMyTrainingActivity/{groupId}` | `select * from activity_trainings where activity_group_id = $1` |
| CRUD jednotek | insert/update/delete na `activity_trainings` |
| `GET .../GetAllLengthUnits` | `select * from activity_training_param_units` |
| `GET .../GetMyOneTrainingActivityForTrainingPlan/{id}` | join activity_trainings + parameters_assign |

### Parameters

| Původní endpoint | Supabase ekvivalent |
|------------------|---------------------|
| `GET .../GetAllMyParameters` | `select * from trainer_parameters where user_id = auth.uid()` |
| `GET .../GetAllMyParametersForActivity/{id}` | filtr na `activity_id` |
| CRUD parametrů | insert/update/delete na `trainer_parameters` |
| `GET .../GetAllParametersTypes` | `select * from parameter_types` |
| `GET .../GetActualParametersForUser/{id}` | `select * from actual_user_parameters` |
| Add/Update actual | insert/update na `actual_user_parameters` |

### TrainingPlan (šablony)

| Původní endpoint | Supabase ekvivalent |
|------------------|---------------------|
| `GET .../GetPlans` | `select * from training_plans where trainer_id = auth.uid()` |
| `GET .../GetEnabledPlans` | + `where enabled = true` |
| `GET .../GetPlanCompleet/{id}` | join týdny + aktivity (view nebo RPC) |
| `POST .../CreatePlan` | `insert into training_plans` |
| `POST .../CreateWeekDefinitionsForPlan` | `insert into training_plan_week_definitions` |
| `POST .../CreateActivityForPlan` | `insert into training_plan_activity_training_assigns` |
| `PUT .../UpdaterPlan/{id}` | `update training_plans` |
| `DELETE .../DeletePlan/{id}` | cascade delete |
| `PUT .../SetPlanEnabled/{id}/{enable}` | `update training_plans set enabled = $2` |

### AssignedTrainingPlan (přiřazené plány)

| Původní endpoint | Supabase ekvivalent |
|------------------|---------------------|
| `GET .../GetMyPlans` | `select * from training_plan_user_assigns where user_id = auth.uid()` |
| `GET .../GetPlansOfUser/{userId}` | `where user_id = $1 and trainer_id = auth.uid()` |
| `GET .../GetPlanCompleet/{id}` | join týdny + aktivity přiřazeného plánu |
| `POST .../CreatePlan` | `insert into training_plan_user_assigns` + týdny + aktivity |
| `GET .../CreatePlanFromTemplateForClient/{planId}/{userId}` | **RPC funkce** `create_plan_from_template(plan_id, user_id, start_date)` |
| `PUT .../SetPlanEnabled/{id}/{enable}` | `update training_plan_user_assigns` |
| `DELETE .../DeletePlan/{id}` | cascade delete |

### TrainingDiary

| Původní endpoint | Supabase ekvivalent |
|------------------|---------------------|
| `GET .../GetMyNotes` | `select * from training_diary_notes where user_id = auth.uid()` |
| `GET .../GetTraineeNotes/{traineeId}` | RLS + filtr na `user_id = traineeId` |
| `POST .../CreateNote` | `insert into training_diary_notes` |
| `PUT .../UpdateNote` | `update training_diary_notes` |
| `DELETE .../DeleteNote/{id}` | `delete from training_diary_notes` |

### RPC funkce (doporučeno pro složitou logiku)

#### `create_plan_from_template`

Kopíruje šablonu (`training_plans` + týdny + aktivity) do `training_plan_user_assigns` + příslušné child tabulky.  
Ekvivalent backend metody v `AssignedTrainingPlanDbInterface.cs`.

```sql
create or replace function create_plan_from_template(
  p_template_id uuid,
  p_user_id uuid,
  p_start_date timestamptz
) returns uuid
language plpgsql security definer
as $$
-- 1. Vytvoř training_plan_user_assigns ze šablony
-- 2. Zkopíruj week_definitions
-- 3. Zkopíruj activity_training_assigns
-- 4. Vrať id nového plánu
$$;
```

#### `get_plan_complete`

Vrátí plán s vnořenými týdny a aktivitami jako JSON.  
Ekvivalent `GetPlanCompleet/{id}`.

---

## 9. Frontend — stránky a routy

### Mapování rout

| Zdrojová route (Vite) | Next.js route | Komponenta (zdroj) | Stav ve zdroji |
|-----------------------|---------------|-------------------|----------------|
| `/`, `/login` | `app/(auth)/login/page.tsx` | `LogInPage` | ✅ Hotovo |
| — | `app/(auth)/register/page.tsx` | (jen UI ve zdroji) | ⚠️ BE existuje, FE nevolá |
| `/dashboard` | `app/(app)/dashboard/page.tsx` | `Dashboard` | ✅ Hotovo |
| `/trainees` | `app/(app)/trainees/page.tsx` | `TraineesPage` | ✅ Hotovo |
| `/trainer` | `app/(app)/trainer/page.tsx` | `TrainerPage` | ⚠️ Základní |
| `/trainee` | `app/(app)/trainee/page.tsx` | `TraineePage` | ⚠️ Základní |
| `/profile` | `app/(app)/profile/page.tsx` | `UserProfile` | ✅ Hotovo |
| `/calendar` | `app/(app)/calendar/page.tsx` | `Calendar` | ✅ Hotovo |
| `/settings` | `app/(app)/settings/page.tsx` | `Settings` | ❌ Placeholder |
| `/my-training-plan` | `app/(app)/my-training-plan/page.tsx` | `MyTrainingPlan` | ❌ Mock data |
| `/my-progress` | `app/(app)/my-progress/page.tsx` | `MyProgress` | ❌ Mock data |
| `/template` | `app/(app)/templates/template/page.tsx` | `TemplateForm` | ✅ Hotovo |
| `/parametr` | — | `ParametrTable` | ⚠️ Hardcoded activityId |
| `/parametr-sport` | `app/(app)/templates/parametr-sport/page.tsx` | `ParametrSportPage` | ✅ Hotovo |
| `/training-sport` | `app/(app)/templates/training-sport/page.tsx` | `TrainingSportPage` | ✅ Hotovo |
| `/sportreport/:sport` | `app/(app)/templates/sport/[sport]/page.tsx` | `SportReportPage` | ✅ Hotovo |
| `/parametr-report` | `app/(app)/templates/parametr-report/page.tsx` | `ParametrReportPage` | ✅ Hotovo |
| `/parametr-report/:activityId` | `app/(app)/templates/parametr-report/[activityId]/page.tsx` | `ParametrReportPage` | ✅ Hotovo |
| `/training-report` | `app/(app)/templates/training-report/page.tsx` | `TrainingReportPage` | ✅ Hotovo |
| `/training-plan` | `app/(app)/templates/training-plan/page.tsx` | `TrainingPlanWizard` | ✅ Hotovo |
| `/training-unit-test` | — | `TrainingUnitTestPage` | 🧪 Dev only — nepřenášet |
| `/training-plan-autofill-test` | — | `TrainingPlanAutoFillTestPage` | 🧪 Dev only — nepřenášet |

### Layout aplikace

**Nepřihlášený uživatel:** pouze auth stránky (bez Navbar/Sidebar/Footer)

**Přihlášený uživatel:** `Navbar` + `Sidebar` + obsah + `Footer`

Zdroj: `mts-fe/src/App.tsx`

---

## 10. Frontend — komponenty a konvence

### Pojmenování

Všechny vlastní komponenty mají prefix **`Space`** (viz `BEST_PRACTICES.md`):

- `SpaceTextField`, `SpaceCard`, `SpaceWeekTabs`, `SpaceTableDialog`, `SpaceTemplatesList`…

### Klíčové komponenty k přenesení

| Složka | Komponenty | Priorita |
|--------|-----------|----------|
| `components/sidebar/` | Sidebar, menu položky | Vysoká |
| `components/navbar/` | Navbar, profil dropdown | Vysoká |
| `components/calendar/` | Calendar, diary dialog | Vysoká |
| `components/tables/` | SpaceTable, expand rows | Vysoká |
| `components/forms/` | SpaceTableDialog, login form | Vysoká |
| `components/cards/` | SpaceCard, sport karty | Střední |
| `components/dialogs/` | Assign plan, confirm | Střední |
| `components/trainee/` | TraineeTrainingPlanView | Střední |
| `components/training/` | Training week table, PDF export | Střední |

### Hooks k přepsání

| Zdrojový hook | Nový ekvivalent |
|---------------|-----------------|
| `useAuth` | `useSupabaseAuth` + `useProfile` |
| `useFetchData` | TanStack Query `useQuery` |
| `useTrainingPlans` | `useTrainingPlans` (Query + Supabase) |
| `useTrainees` | `useTrainees` |
| `useTrainingDiary` | `useTrainingDiary` |
| `useTableData` | `useTableData` (Query) |
| `useUserRole` | `useUserRole` (z profiles.role) |

### TypeScript typy

Přenést a upravit: `mts-fe/src/types/trainingTypes.ts`

Klíčové interfaces:
- `TrainingPlan`, `TrainingPlanSerialized`
- `AssignedTrainingPlan`
- `CreateTrainingPlanRequest`, `UpdateTrainingPlanRequest`
- `TrainingDiaryNote`
- `UserShort`
- `ActivityForTraining`, `ActivityTrainingViewModel`

### Theme

Přenést: `mts-fe/src/styles/theme.ts` — light/dark mode přes `localStorage` klíč `theme`.

---

## 11. Klíčová business logika

### 11.1 Training Plan Wizard (5 kroků)

Zdroj: `mts-fe/src/pages/app/templates/pages/TrainingPlanWizzard.tsx`

| Krok | Obsah |
|------|-------|
| 1 | Délka plánu (počet týdnů / cyklů) |
| 2 | Výběr tréninkových dnů v týdnu |
| 3 | Editor týdnů (km, čas, popis) |
| 4 | Editor jednotlivých dnů (aktivita → skupina → jednotka) |
| 5 | Finální krok: uložit jako šablonu NEBO přiřadit cvičenci |

**Sekvenční ukládání přiřazeného plánu (zachovat logiku):**

```
1. INSERT training_plan_user_assigns → získat assign_id
2. Pro každý týden: INSERT training_plan_user_assign_week_definitions
3. Pro každý den s aktivitou: INSERT training_plan_user_assign_activity_training_assigns
```

V Supabase ideálně zabalit do jedné RPC transakce.

### 11.2 Kopírování šablony pro cvičence

Zdroj: `TraineesPage.tsx` volá `CreatePlanFromTemplateForClient/{planId}/{userId}?dateTimeStart=`

Implementovat jako RPC `create_plan_from_template`.

### 11.3 Kalendář

Zdroj: `mts-fe/src/components/calendar/Calendar.tsx`

1. Načíst plány (trenér: plány cvičenců; cvičenec: vlastní)
2. Pro každý plán načíst kompletní data (týdny + aktivity)
3. Rozložit aktivity na kalendářní dny od `date_time_start`
4. Klik na trénink → dialog pro poznámku do deníku
5. Načíst km/čas z parametrů jednotky

### 11.4 Správa sportovců

Zdroj: `mts-fe/src/pages/app/users/trainer/TraineesPage.tsx`

- Seznam cvičenců (`profiles where trainer_id = me`)
- Přiřazení plánu ze šablony
- Enable/disable plánu
- Smazání plánu
- Převod plánu na šablonu
- Editace sportovce: **TODO ve zdroji** — implementovat v novém projektu

### 11.5 PDF export

Zdroj: `TraineeTrainingPlanView`, `TrainingPlanDetail`, `SpaceTrainingWeekTable`

Technologie: `html2canvas` → `jspdf` — přenést beze změny.

### 11.6 Dashboard

Zdroj: `mts-fe/src/pages/app/users/dashboard/Dashboard.tsx`

- **Trenér:** seznam šablon + pokroky cvičenců
- **Cvičenec:** přehled vlastních plánů

---

## 12. Fázový plán implementace

### Fáze 0 — Příprava (1–2 dny)

- [ ] Vytvořit nový Next.js projekt
- [ ] Nastavit Supabase projekt (lokální `supabase start` nebo cloud)
- [ ] Nastavit `.env.local`
- [ ] Založit Git repozitář

### Fáze 1 — Databáze a Auth (3–5 dní)

- [ ] SQL migrace: `profiles`, `activities`, seed data
- [ ] Supabase Auth (email/password)
- [ ] Trigger: `on_auth_user_created` → insert do `profiles`
- [ ] RLS na `profiles`
- [ ] Login / Register stránky
- [ ] Middleware pro chráněné routy
- [ ] Layout: Navbar + Sidebar + Footer
- [ ] Role-based menu

**Výstup:** Přihlášení, registrace, dashboard placeholder, role v menu.

### Fáze 2 — Aktivity, skupiny, jednotky (5–7 dní)

- [ ] Migrace tabulek: `activity_groups`, `activity_trainings`, `activity_training_param_units`, `activity_training_parameters_assign`, `trainer_activity_enable`
- [ ] RLS politiky
- [ ] Stránky: `training-sport`, `sport/[sport]` (CRUD skupin a jednotek v tabulce)
- [ ] Přenést `SpaceTable` s expand rows
- [ ] Seed: globální aktivity + ukázkové skupiny

**Výstup:** Trenér spravuje skupiny a jednotky per sport.

### Fáze 3 — Parametry (3–4 dny)

- [ ] Migrace: `parameter_types`, `trainer_parameters`, `actual_user_parameters`
- [ ] Stránky: `parametr-sport`, `parametr-report`
- [ ] CRUD parametrů v tabulce
- [ ] Aktuální hodnoty parametrů cvičence

**Výstup:** Trenér definuje parametry, vidí hodnoty cvičenců.

### Fáze 4 — Šablony tréninkových plánů (7–10 dní)

- [ ] Migrace: `training_plans`, `training_plan_week_definitions`, `training_plan_activity_training_assigns`
- [ ] Training Plan Wizard (5 kroků)
- [ ] Seznam šablon na dashboardu
- [ ] Detail šablony + PDF export
- [ ] Enable/disable šablony

**Výstup:** Trenér vytváří a spravuje šablony plánů.

### Fáze 5 — Přiřazené plány a sportovci (5–7 dní)

- [ ] Migrace: `training_plan_user_assigns` + child tabulky
- [ ] RPC: `create_plan_from_template`
- [ ] Stránka `trainees` — správa cvičenců
- [ ] Přiřazení plánu ze šablony
- [ ] Wizard: uložení přímo pro cvičence

**Výstup:** Trenér přiřazuje plány cvičencům.

### Fáze 6 — Kalendář a tréninkový deník (5–7 dní)

- [ ] Migrace: `training_diary_notes`
- [ ] Kalendář s rozložením plánů
- [ ] CRUD poznámek v deníku
- [ ] Trenér vidí poznámky cvičenců

**Výstup:** Plně funkční kalendář s deníkem.

### Fáze 7 — Cvičenec a dokončení (5–7 dní)

- [ ] `/my-training-plan` — napojit na reálná data (nahradit mock)
- [ ] `/my-progress` — implementovat z `actual_user_parameters` + historie
- [ ] `/profile` — editace profilu, avatar
- [ ] `/settings` — nastavení (téma, notifikace…)
- [ ] Responzivní design (mobil)
- [ ] Odstranit nepoužité závislosti

**Výstup:** Kompletní aplikace pro obě role.

### Fáze 8 — Migrace dat (volitelné)

- [ ] Export dat z SQL Server (`MTS.bak`)
- [ ] Konverze do PostgreSQL (pgloader nebo ruční skript)
- [ ] Migrace uživatelů → vyžaduje reset hesel (plaintext nelze bezpečně přenést)

---

## 13. Environment proměnné

```env
# .env.local

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...          # pouze server-side, NIKDY v klientu

# Volitelné
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### localStorage klíče (zachovat kompatibilitu UI)

| Klíč | Hodnota | Účel |
|------|---------|------|
| `theme` | `'light'` \| `'dark'` | Téma aplikace |

> Token a user v localStorage **nepoužívat** — session přes Supabase cookies.

---

## 14. Známé problémy a rozhodnutí

| Problém | Zdroj | Rozhodnutí pro nový projekt |
|---------|-------|----------------------------|
| Admin role: FE=99, BE=1000 | `useAuth.ts` vs `Definitions.cs` | Sjednotit na `1000` |
| Registrace: FE `/User/register` vs BE `/User/registration` | `api.ts` vs controller | Supabase `signUp` — jeden endpoint |
| Plaintext hesla v DB | `UserDbInterface` | Supabase Auth — hesla nikdy v `profiles` |
| Sliding JWT v `X-Auth-Header` | `AuthorizeFacade` | Supabase refresh token mechanismus |
| Hardcoded API URL | `api.ts` | Env proměnné |
| `axios`, `react-query`, `jwt-decode` nepoužity | `package.json` | Neinstalovat |
| Dva endpointy `GetPlans` (šablony vs assigned) | Backend routing konflikt | V Supabase oddělené tabulky — konflikt nehrozí |
| `parametr` route hardcoded `activityId="activity-1"` | `Routes.tsx` | Dynamická route s parametrem |
| `templatesSlice` mock data | Redux | Odstranit, data z Supabase |
| TEAM entity bez API | `MtsContext.cs` | Implementovat až na vyžádání |

---

## 15. Co zatím není hotové ve zdrojovém projektu

Tyto položky **nejsou** ve zdroji funkční — v novém projektu je buď implementovat, nebo vědomě vynechat:

| Funkce | Stav | Doporučení |
|--------|------|------------|
| Registrace (FE) | UI existuje, nevolá API | Implementovat přes Supabase Auth |
| `/my-training-plan` | Mock data | Napojit na `training_plan_user_assigns` |
| `/my-progress` | Statická mock data | Napojit na `actual_user_parameters` |
| `/settings` | Placeholder | Implementovat (téma, profil) |
| Editace sportovce | TODO v `TraineesPage` | Implementovat update `profiles` |
| Editace existujícího plánu ve wizardu | TODO | Implementovat update flow |
| CRUD parametrů (add/edit/delete) | Částečně | Dokončit |
| Mobilní responzivita | TODO | Priorita ve fázi 7 |
| Avatar upload | TODO (jen emoji index) | Supabase Storage |
| Google OAuth | Legacy FE měl client ID, BE ne | Volitelně přes Supabase Auth |
| Strava integrace | Zakomentováno v legacy | Vynechat |
| Marketing stránky (`/home`, `/about`…) | Existují, nejsou v routách | Vynechat |

---

## 16. Referenční soubory

### Frontend (MTS.FE)

| Soubor | Obsah |
|--------|-------|
| `mts-fe/src/api/api.ts` | Kompletní mapa API endpointů |
| `mts-fe/src/helpers/router/Routes.tsx` | Všechny routy |
| `mts-fe/src/types/trainingTypes.ts` | Doménové TypeScript typy |
| `mts-fe/src/store/hooks/useAuth.ts` | Auth flow + role mapping |
| `mts-fe/src/store/slices/authSlice.ts` | User model, role enum |
| `mts-fe/src/helpers/hooks/useTrainingPlans.ts` | Logika tréninkových plánů |
| `mts-fe/src/helpers/hooks/useTrainingDiary.ts` | Tréninkový deník |
| `mts-fe/src/helpers/hooks/useTrainees.ts` | Seznam cvičenců |
| `mts-fe/src/pages/app/templates/pages/TrainingPlanWizzard.tsx` | 5-krokový wizard |
| `mts-fe/src/pages/app/users/trainer/TraineesPage.tsx` | Správa sportovců |
| `mts-fe/src/components/calendar/Calendar.tsx` | Kalendář |
| `mts-fe/src/App.tsx` | Layout podmíněný auth |
| `mts-fe/src/styles/theme.ts` | Theme konfigurace |
| `BEST_PRACTICES.md` | Konvence vývoje |
| `TODO.md` | Nedokončené úkoly |

### Backend (mpa)

| Soubor | Obsah |
|--------|-------|
| `MTS.TestProject/MTS.TestProject/DB/MtsContext.cs` | Kompletní DB schéma (EF mapování) |
| `MTS.TestProject/MTS.TestProject/DB/Repository.cs` | Seed data |
| `MTS.TestProject/MTS.TestProject/Helpers/Definitions.cs` | Role enum |
| `MTS.TestProject/MTS.TestProject/Code/Facades/AuthorizeFacade.cs` | JWT logika |
| `MTS.TestProject/MTS.TestProject/Code/DbInterfaces/AssignedTrainingPlanDbInterface.cs` | Kopírování šablony |
| `MTS.TestProject/MTS.TestProject/Code/DbInterfaces/UserDbInterface.cs` | Login/registrace |
| `MTS.TestProject/MTS.TestProject/Controllers/*.cs` | REST endpointy |
| `MTS.TestProject/MTS.TestProject/appsettings.json` | Connection string, JWT config |
| `DB/MTS.bak` | SQL Server backup s reálnými daty |
| `DB/add_training_diary_note.sql` | Migrace deníku |
| `DB/add_trainees.sql` | Seed cvičenců |

---

## 17. Akceptační kritéria

### Minimální viable produkt (MVP)

- [ ] Trenér se přihlásí a vidí dashboard se šablonami
- [ ] Trenér vytvoří skupiny a jednotky pro sport
- [ ] Trenér vytvoří šablonu tréninkového plánu (wizard)
- [ ] Trenér přiřadí plán cvičenci
- [ ] Cvičenec se přihlásí a vidí svůj plán
- [ ] Oba uživatelé vidí kalendář s tréninky
- [ ] Cvičenec přidá poznámku do tréninkového deníku
- [ ] Trenér vidí poznámky svých cvičenců
- [ ] Role-based navigace funguje správně
- [ ] RLS zabraňuje přístupu k cizím datům

### Plná verze

- [ ] Vše z MVP
- [ ] CRUD parametrů včetně aktuálních hodnot cvičenců
- [ ] PDF export tréninkového plánu
- [ ] Stránka pokroku cvičence (`/my-progress`)
- [ ] Editace profilu a nastavení
- [ ] Responzivní design pro mobil
- [ ] Registrace nových uživatelů
- [ ] Seed data pro vývoj a testování

---

## Příloha A — Testovací účty (seed)

| Uživatel | Nick | Heslo | Role |
|----------|------|-------|------|
| Trenér | pepa | pepa | Trainer (20) |
| Cvičenec 1 | (viz Repository.cs) | pepa | User (1) |
| Cvičenec 2 | (viz Repository.cs) | pepa | User (1) |

---

## Příloha B — Diagram architektury cílového řešení

```
┌─────────────────────────────────────────────────────────┐
│                    Next.js App                          │
│  ┌──────────┐  ┌──────────┐  ┌───────────────────────┐  │
│  │  Pages   │  │Components│  │  lib/services/        │  │
│  │ (App     │  │ (Space*) │  │  (Supabase queries)   │  │
│  │  Router) │  │          │  │                       │  │
│  └────┬─────┘  └────┬─────┘  └───────────┬───────────┘  │
│       │             │                    │              │
│  ┌────┴─────────────┴────────────────────┴───────────┐  │
│  │              @supabase/ssr (middleware)            │  │
│  └──────────────────────┬──────────────────────────┘  │
└─────────────────────────┼───────────────────────────────┘
                          │
              ┌───────────┴───────────┐
              │      Supabase         │
              │  ┌─────────────────┐  │
              │  │   Auth          │  │
              │  │   (JWT/cookies) │  │
              │  └─────────────────┘  │
              │  ┌─────────────────┐  │
              │  │   PostgreSQL    │  │
              │  │   + RLS         │  │
              │  └─────────────────┘  │
              │  ┌─────────────────┐  │
              │  │   RPC Functions │  │
              │  │   (templates,   │  │
              │  │    plan copy)   │  │
              │  └─────────────────┘  │
              └───────────────────────┘
```

---

*Dokument vytvořen: červen 2026*  
*Založeno na analýze repozitářů MTS.FE a mpa.*
