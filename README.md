# MyTrainingSpace (MTS)

Webová aplikace pro plánování tréninků mezi **trenérem** a **cvičenci**.
Postavená na **Next.js 16 (App Router)** + **Supabase** (PostgreSQL, Auth, RLS).

## Stack

- Next.js 16, React 19, TypeScript
- Supabase (`@supabase/supabase-js`, `@supabase/ssr`)
- MUI v6 + Emotion
- TanStack Query (server state), React Context (UI state)
- react-hook-form + zod, date-fns, react-big-calendar, jspdf

## Lokální vývoj

```bash
npm install --legacy-peer-deps
cp .env.example .env.local   # vyplň reálné hodnoty ze Supabase projektu
npm run dev
```

Aplikace běží na http://localhost:3000.

## Environment proměnné (`.env.local`)

| Proměnná | Popis |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL Supabase projektu |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Veřejný anon klíč |
| `SUPABASE_SERVICE_ROLE_KEY` | Servisní klíč (jen lokálně/seed, NIKDY do klienta) |

## Databáze (Supabase cloud)

1. Ve Supabase Dashboardu otevři **SQL Editor**.
2. Spusť postupně soubory z `supabase/migrations/` (vzestupně podle čísla).
3. Spusť `supabase/seed.sql` (globální katalog sportů).
4. Volitelně založ testovací uživatele:

```bash
node supabase/seed-users.mjs
```

Testovací trenér: `pepa@mts.test` / `pepa1234`.

## Struktura

```
app/            App Router routy ((auth), (app))
components/     UI primitiva (Space*), layout, doménové komponenty
lib/            supabase klienti, services (datová vrstva), constants
hooks/          TanStack Query hooky
types/          doménové a DB typy
styles/         MUI theme
supabase/       SQL migrace + seed
```

Konvence projektu jsou v `.cursor/rules/`.
