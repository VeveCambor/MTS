# Deploy na Vercel

Návod pro nasazení **MyTrainingSpace** (Next.js 16 + Supabase).

## Předpoklady

- GitHub repo s projektem
- Supabase cloud projekt s migracemi a seed daty
- Vercel účet (propojený s GitHubem)

---

## 1. Supabase — databáze a auth

### Migrace a seed

V **Supabase Dashboard → SQL Editor** spusť v pořadí:

1. `supabase/migrations/0002_activities.sql` … až `0010_trainer_invites.sql`
2. `supabase/seed.sql`

### Testovací uživatel (volitelné, lokálně)

```bash
# vyžaduje SUPABASE_SERVICE_ROLE_KEY v .env.local
node supabase/seed-users.mjs
```

Login: `pepa@mts.test` / `pepa1234`

### Auth URL (po prvním deployi na Vercel)

**Authentication → URL Configuration**

| Pole | Hodnota |
|------|---------|
| **Site URL** | `https://<tvuj-projekt>.vercel.app` |
| **Redirect URLs** | `https://<tvuj-projekt>.vercel.app/**` |
| | `https://<tvuj-projekt>.vercel.app/auth/callback` |
| | `http://localhost:3002/**` (lokální vývoj) |

> Pokud je **Site URL** nastavené na `http://localhost:3002`, potvrzovací e-mail po registraci povede na localhost i v produkci. Nastav produkční URL a redeploy.

---

## 2. Vercel — nový projekt

1. [vercel.com/new](https://vercel.com/new) → Import Git Repository
2. Vyber repo **MTS**
3. Framework: **Next.js** (automaticky)
4. Root Directory: `.` (kořen repozitáře)

Build nastavení (mělo by být automaticky z `vercel.json`):

| Nastavení | Hodnota |
|-----------|---------|
| Install Command | `npm install` (`.npmrc` řeší peer deps) |
| Build Command | `npm run build` |
| Output | Next.js default |

5. **Environment Variables** — přidej pro **Production**, **Preview** i **Development**:

| Klíč | Kde ho najdeš |
|------|----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API → anon public |
| `NEXT_PUBLIC_SITE_URL` | `https://<tvuj-projekt>.vercel.app` (bez lomítka na konci) |

6. Deploy

---

## 3. Co na Vercel NEDÁVAT

| Proměnná | Proč |
|----------|------|
| `SUPABASE_SERVICE_ROLE_KEY` | Aplikace ho za běhu nepotřebuje; obchází RLS — bezpečnostní riziko |

Service role klíč používej jen lokálně pro `seed-users.mjs`.

---

## 4. Ověření po deployi

- [ ] `https://<projekt>.vercel.app/login` se načte
- [ ] Přihlášení funguje (seed uživatel nebo nová registrace)
- [ ] Dashboard a wizard plánu načítají data ze Supabase
- [ ] Site URL v Supabase odpovídá produkční doméně

---

## 5. Preview deploye (PR větve)

Vercel vytváří preview URL pro každý push/PR. Stejné env proměnné musí být nastavené i pro **Preview**, jinak preview build spadne nebo nebude mít data.

Preview může sdílet stejnou Supabase instanci jako production (pro testování OK).

---

## 6. Vlastní doména (volitelné)

1. Vercel → Project → **Settings → Domains**
2. Přidej doménu a nastav DNS dle návodu Vercel
3. Aktualizuj **Site URL** a **Redirect URLs** v Supabase

---

## Řešení problémů

| Problém | Řešení |
|---------|--------|
| `prerender-error` / chybí Supabase URL a key | Nastav env proměnné na Vercel **před** deployem (Production + Preview). Redeploy po doplnění. |
| Build fail `npm install` | Ověř, že v repu je `.npmrc` s `legacy-peer-deps=true` |
| MUI „module has no exports“ | V `next.config.ts` nesmí být `@mui/material` v `optimizePackageImports` |
| Prázdné stránky / 401 | Chybí env proměnné na Vercel |
| Login redirect loop | Site URL v Supabase ≠ Vercel doména |
| Žádná data | V cloud Supabase nejsou migrace + seed |

---

## Lokální build (kontrola před pushem)

```bash
npm install
npm run build
```

Úspěšný build = Vercel build by měl projít stejně.
