# MyTrainingSpace — Popis designu, tabulek a datového obsahu

> Kompletní referenční dokument pro nový projekt (Next.js + Supabase).  
> Vychází ze zdrojových projektů `MTS.FE` (UI) a `mpa` (seed data v `Repository.cs`).

---

## Obsah

1. [Vizuální identita a design systém](#1-vizuální-identita-a-design-systém)
2. [Layout aplikace](#2-layout-aplikace)
3. [Komponenty UI](#3-komponenty-ui)
4. [Přehled všech tabulek v aplikaci](#4-přehled-všech-tabulek-v-aplikaci)
5. [Globální sporty (aktivity)](#5-globální-sporty-aktivity)
6. [Skupiny tréninků](#6-skupiny-tréninků)
7. [Tréninkové jednotky](#7-tréninkové-jednotky)
8. [Parametry — typy, definice a hodnoty](#8-parametry--typy-definice-a-hodnoty)
9. [Jednotky délky a času](#9-jednotky-délky-a-času)
10. [Tréninkové plány (šablony a přiřazené)](#10-tréninkové-plány-šablony-a-přiřazené)
11. [Uživatelé a role](#11-uživatelé-a-role)
12. [Doporučený obsah pro další sporty](#12-doporučený-obsah-pro-další-sporty)
13. [Stránky s mock daty (co doplnit)](#13-stránky-s-mock-daty-co-doplnit)

---

## 1. Vizuální identita a design systém

### Celkový styl

Aplikace má **moderní, čistý sportovní vzhled** s gradientním pozadím, zaoblenými rohy (16–20 px), jemnými stíny a přechody. Podporuje **light** a **dark** režim přepínatelný v navbaru (ikona Slunce/Měsíc). Uložení preference: `localStorage` klíč `theme`.

### Typografie

| Prvek | Hodnota |
|-------|---------|
| Font | `Inter`, `Poppins`, sans-serif |
| H1 | 2.5 rem, weight 700 |
| H2 | 2 rem, weight 600 |
| H3 | 1.5 rem, weight 600 |
| Tělo | line-height 1.6 |
| Tabulky — hlavička | 0.9 rem, weight 600 |

### Light theme — barvy

| Token | Hodnota | Použití |
|-------|---------|---------|
| `background` | gradient `#F1F5F9 → #E2E8F0` | Pozadí stránky |
| `text` | `#1F2937` | Hlavní text |
| `textSecondary` | `#6B7280` | Vedlejší text |
| `icons` | `#4B5563` | Ikony |
| `iconsHover` | `#8B5CF6` | Hover ikon |
| `button` | gradient `#4C1D95 → #5B21B6` | Primární tlačítka |
| `buttonHover` | gradient `#5B21B6 → #6D28D9` | Hover tlačítka |
| `textButton` | `#FFFFFF` | Text na tlačítku |
| `cardBackground` | gradient `#FFFFFF → #F8FAFC` | Karty |
| `cardBorder` | `#E2E8F0` | Okraj karet |
| `cardShadow` | `rgba(139, 92, 246, 0.1)` | Stín karet |
| `sidebarBackground` | `#FFFFFF` | Sidebar |
| `sidebarActive/Hover` | gradient `#F0F9FF → #E0F2FE` | Aktivní položka menu |
| `outlineHover` | `#8B5CF6` | Focus/outline |
| `tableBackground` | `#FFFFFF` | Tabulky |
| `componentBackground` | `#FFFFFF` | Inputy, panely |

### Dark theme — barvy

| Token | Hodnota | Použití |
|-------|---------|---------|
| `background` | gradient `#0F172A → #18172e → #1E1B4B` | Pozadí |
| `text` | `#F8FAFC` | Hlavní text |
| `textSecondary` | `#94A3B8` | Vedlejší text |
| `icons` | `#99FFEC` | Ikony (mint akcent) |
| `iconsHover` | `#FFFFFF` | Hover |
| `button` | `#99FFEC` | Primární tlačítka |
| `buttonHover` | `#7DD3FC` | Hover |
| `textButton` | `#1B1B3A` | Text na tlačítku |
| `cardBackground` | `#1E293B` | Karty |
| `cardBorder` | `#334155` | Okraje |
| `sidebarBackground` | `#1E293B` | Sidebar |
| `outlineHover` | `#99FFEC` | Akcent |

### CSS proměnné (legacy, stále v GlobalStyles)

| Proměnná | Hodnota | Význam |
|----------|---------|--------|
| `--color-primary` | `#1B1B3A` | Tmavě modrá |
| `--color-tertiary` | `#99FFEC` | Mint akcent (dark mode) |
| `--color-purple` | `#914DF6` | Fialová |
| `--color-pink` | `#C465FF` | Růžová |
| `--color-outline` | `#0FFFFF` | Cyan outline |

### Akcentní barvy sportů (karty)

| Sport | Barva | Ikona (react-icons) |
|-------|-------|---------------------|
| Běh | `#06B6D4` (cyan) | `FaRunning` |
| Cyklistika | `#8B5CF6` (fialová) | `FaBicycle` |
| Plavání | `#EC4899` (růžová) | `FaSwimmer` |
| Běžky | `#10B981` (zelená) | `FaMountain` |
| Chůze | `#06B6D4` (cyan) | `FaWalking` |
| Jóga | `#8B5CF6` (fialová) | `FaYinYang` |
| SM systém | `#10B981` (zelená) | `FaHeart` |
| Silový trénink | `#EC4899` (růžová) | `FaDumbbell` |

### Styly karet sportů (`SpaceSportCard`)

- Rozměr: **200 × 200 px**, `border-radius: 16px` (nebo 50 % pro kulatý vzhled)
- Gradient pozadí, `backdrop-filter: blur(10px)`
- Hover: posun nahoru `translateY(-6px)`, zesílený stín v barvě sportu
- Ikona v kruhu 60 × 60 px s gradientním pozadím (`color` + 20 % opacity)

### Styly tabulek

- Kontejner: `Paper` s `border-radius: 16px`, padding 24 px
- Vnitřní tabulka: `border-radius: 12px`
- Hlavička: `font-weight: 600`, spodní border `theme.cardBorder`
- Hover řádku: `theme.hoverBackground`
- Akční ikony: Edit, Delete, Add, ExpandMore/Less (MUI icons)
- Snackbar notifikace: success `#D1FAE5` / error `#FEE2E2`, `border-radius: 12px`

### Kalendář (`react-big-calendar`)

- Vlastní styly v `GlobalStyles.tsx` pro `.rbc-header`, `.rbc-event`, `.rbc-today`
- Barvy přizpůsobené aktivnímu theme

---

## 2. Layout aplikace

### Nepřihlášený uživatel

```
┌─────────────────────────────────────┐
│  Navbar (logo, tlačítko Přihlásit)  │
├─────────────────────────────────────┤
│                                     │
│         Login / Register            │
│                                     │
└─────────────────────────────────────┘
```

### Přihlášený uživatel

```
┌──────────────────────────────────────────────────────────┐
│  Navbar (menu ikona, logo, theme toggle, profil dropdown) │
├────┬─────────────────────────────────────────────────────┤
│ S  │                                                     │
│ i  │              Hlavní obsah stránky                   │
│ d  │                                                     │
│ e  │                                                     │
│ b  │                                                     │
│ a  │                                                     │
│ r  │                                                     │
├────┴─────────────────────────────────────────────────────┤
│  Footer                                                  │
└──────────────────────────────────────────────────────────┘
```

### Sidebar (šířka 75 px, zaoblení 20 px)

| Ikona | Položka | Role | Route |
|-------|---------|------|-------|
| Activity | Přehled | Všichni | `/dashboard` |
| File ▾ | Šablony | Trenér | dropdown |
| ↳ | Skupiny | Trenér | `/training-sport` |
| ↳ | Parametry | Trenér | `/parametr-sport` |
| ↳ | Tréninkový plán | Trenér | `/training-plan` |
| Users | Sportovci | Trenér | `/trainees` |
| Target | Můj plán | Cvičenec | `/my-training-plan` |
| BarChart | Pokrok | Cvičenec | `/my-progress` |
| Calendar | Kalendář | Všichni | `/calendar` |
| Settings | Nastavení | Všichni | `/settings` |

### Navbar

- Výška: 70 px (přihlášený) / 60 px (nepřihlášený)
- Logo: `new-logo.png` (light) / `new-logo2.png` (dark)
- Profil dropdown: avatar (emoji index 0–7), odhlášení, nastavení profilu

---

## 3. Komponenty UI

### Konvence pojmenování

Všechny vlastní komponenty mají prefix **`Space`**:

`SpaceTextField`, `SpaceCard`, `SpaceSportCard`, `SpaceUniverseTable`, `SpaceTableDialog`, `SpaceTraineesTable`, `SpaceTemplatesList`, `SpaceTrainingWeekTable`, `SpaceToolTip`…

### Klíčové komponenty

| Komponenta | Účel |
|-----------|------|
| `SpaceUniverseTable` | Univerzální tabulka s expand rows, CRUD, dialogy |
| `SpaceTableDialog` | Modal formulář pro add/edit (Formik + Yup) |
| `SpaceSportCard` | Kulatá/kartová dlaždice sportu |
| `SpaceTraineesTable` | Tabulka sportovců s rozbalenými plány |
| `SpaceTrainingWeekTable` | Tabulka týdnů/dnů v plánu |
| `TraineeTrainingPlanView` | Detail plánu cvičence + PDF export |
| `Calendar` | Kalendář tréninků + deník |
| `TrainingPlanWizard` | 5-krokový wizard tvorby plánu |
| `SpaceConfirmDialog` | Potvrzení smazání |

### Wizard tréninkového plánu — kroky

| Krok | Název | Obsah |
|------|-------|-------|
| 1 | Délka plánu | Počet týdnů (cyklů), délka cyklu (dní) |
| 2 | Dny v týdnu | Výběr tréninkových dnů (Po–Ne) |
| 3 | Editor týdnů | Km, čas, popis, poznámka per týden |
| 4 | Editor dnů | Aktivita → skupina → jednotka per den |
| 5 | Finální krok | Uložit jako šablonu NEBO přiřadit cvičenci |

---

## 4. Přehled všech tabulek v aplikaci

### 4.1 Tabulka tréninkových skupin (`TrainingReportTable`)

**Stránka:** `/sportreport/:sport` (po výběru sportu ze `/training-sport`)  
**Titulek:** „Tréninkové skupiny"

#### Hlavní řádky (skupiny)

| Sloupec | Klíč | Popis |
|---------|------|-------|
| (expand) | — | Šipka pro rozbalení jednotek |
| Tréninková skupina | `name` | Zkratka/název skupiny (např. BZ, BR) |
| Popis | `description` | Plný popis skupiny |
| Akce | — | Přidat / Upravit / Smazat |

#### Rozbalené řádky (jednotky)

| Sloupec | Klíč | Popis |
|---------|------|-------|
| Pořadí | `order` | Pořadí jednotky ve skupině |
| Popis | `description` | Popis jednotky |
| Jednotka | `unit` | Jednotka délky (km, min…) |
| Parametr | `parameter` | Název parametru (tepy, tempo…) |
| Hodnota | `value` | Číselná hodnota (délka, rozsah) |
| Akce | — | Přidat / Upravit / Smazat |

#### Dialog — přidání/editace skupiny

| Pole | Label |
|------|-------|
| `name` | Tréninková skupina |
| `description` | Popis |

#### Dialog — přidání/editace jednotky

| Pole | Label | Typ |
|------|-------|-----|
| `order` | Pořadí | text/number |
| `description` | Popis | text |
| `unit` | Jednotka | select (km, min, h…) |
| `parameter` | Parametr | select (z trenérských parametrů) |
| `value` | Hodnota | select/number |

---

### 4.2 Tabulka parametrů (`ParametrTableInner`)

**Stránka:** `/parametr-report/:activityId` (po výběru sportu ze `/parametr-sport`)  
**Titulek:** „Tréninkové parametry"

| Sloupec | Klíč | Popis |
|---------|------|-------|
| Trénink | `name` | Název parametru |
| Popis | `description` | Popis parametru |
| Jednotka | `unit` | Jednotka měření (tep/min, min/km, km/h) |
| Akce | — | Přidat / Upravit / Smazat |

**Poznámka:** Bez expand rows (`showExpandRows: false`).

#### Dialog — přidání/editace parametru

| Pole | Label |
|------|-------|
| `name` | Název |
| `description` | Popis |
| `unit` | Jednotka |

---

### 4.3 Tabulka sportovců (`SpaceTraineesTable`)

**Stránka:** `/trainees`  
**Pouze pro trenéra**

#### Hlavní řádky (sportovci)

| Sloupec | Popis |
|---------|-------|
| (expand) | Rozbalení seznamu plánů |
| Jméno | `firstName` + `lastName` (nebo nick) |
| Email | Email cvičence |
| Počet plánů | Počet přiřazených plánů |
| Akce | Editovat sportovce, Přidat plán ze šablony, Nový plán |

#### Rozbalené řádky (plány sportovce)

| Sloupec | Popis |
|---------|-------|
| Název plánu | `name` |
| Popis | `description` |
| Stav | Chip Enabled/Disabled |
| Akce | Editovat, Smazat, Převést na šablonu, Enable/Disable |

---

### 4.4 Tabulka tréninkového plánu — týdny/dny (`SpaceTrainingWeekTable`)

**Stránka:** Wizard krok 3–4, detail plánu

| Sloupec | Popis |
|---------|-------|
| Týden | Číslo týdne + poznámka (editovatelná) |
| Den | Datum / den v týdnu |
| Aktivita | Sport (běh, kolo…) |
| Kategorie | Skupina (BZ, BR…) |
| Jednotka | Tréninková jednotka (BZ1, BR2…) |
| Km | Očekávané km |
| Čas | Očekávaný čas |
| Akce | Editovat den, přidat den (+) |

---

### 4.5 Tabulka plánu cvičence (`TraineeTrainingPlanView`)

**Stránka:** Dashboard cvičence, `/my-training-plan`

| Sloupec | Popis |
|---------|-------|
| Den | Datum |
| Pohybová aktivita | Sport |
| Čas | Očekávaný/provedený čas |
| Km | Kilometry |
| Provedeno | Checkbox / stav splnění |
| Poznámka | Text poznámky z deníku |

---

### 4.6 Tabulka šablon (`SpaceTemplatesList`)

**Stránka:** Dashboard trenéra

| Sloupec | Popis |
|---------|-------|
| Název | Název šablony |
| Popis | Popis plánu |
| Počet týdnů | `numberOfCycles` |
| Stav | Enabled / Disabled |
| Akce | Detail, Upravit, Smazat, Přiřadit cvičenci |

---

## 5. Globální sporty (aktivity)

Globální katalog — **stejný pro všechny trenéry**. Trenér si aktivuje oblíbené přes `trainer_activity_enable`.

| # | Název (DB) | Název (UI karta) | Popis | Ikona (DB) | Barva UI | Route slug |
|---|------------|------------------|-------|------------|----------|------------|
| 1 | Běhání | Běh | Běh | `run.png` | `#06B6D4` | `běh` |
| 2 | Plavání | Plavání | Plavání | `swim.png` | `#EC4899` | `plavání` |
| 3 | Jízda na kole | Cyklistika | Cyklistika | `bike.png` | `#8B5CF6` | `cyklistika` |
| 4 | Silový tréning | Silový trénink | Silový tréning | `gym.png` | `#EC4899` | `silový-trénink` |
| 5 | Chůze | Chůze | Chůze | `walk.png` | `#06B6D4` | `chůze` |
| 6 | Jóga | Jóga | Jóga | `yoga.png` | `#8B5CF6` | `jóga` |
| 7 | SM systém | SM Systém | SM systém | `smsystem.png` | `#10B981` | `sm-systém` |
| 8 | Běžky | Běžky | Běžky | `skiing.png` | `#10B981` | `běžky` |

### Rozložení na stránce výběru sportu

**Řádek 1:** Běh, Cyklistika, Plavání, Běžky  
**Řádek 2:** Chůze, Jóga, SM Systém, Silový trénink

---

## 6. Skupiny tréninků

Skupiny jsou **vlastnictvím trenéra** — každý trenér si vytváří vlastní skupiny per sport.

### Seed data (trenér `pepa`, sport Běhání)

| Zkratka | Název | Popis | Sport |
|---------|-------|-------|-------|
| **BZ** | BZ | Běh základní | Běhání |
| **BR** | BR | Běh rychlostní | Běhání |

### Doporučené skupiny pro ostatní sporty (nový projekt)

| Sport | Doporučené skupiny | Popis |
|-------|-------------------|-------|
| Cyklistika | VZ, VR, VK | Vytrvalost základní / rychlostní / kopce |
| Plavání | PZ, PR, PT | Plavání základní / rychlostní / technika |
| Silový trénink | HK, SK, OP | Horní končetiny / Spodní končetiny / Opakování |
| Běžky | BZ, BR, BH | Běžky základní / rychlostní / horské |
| Chůze | CHZ, CHR | Chůze základní / rychlá |
| Jóga | JZ, JP, JV | Jóga základní / power / vinyasa |
| SM systém | SMZ, SMA | SM základní / pokročilý |

> Ve zdrojovém projektu jsou skupiny seedované **pouze pro běh**. Ostatní sporty mají prázdné skupiny — trenér je vytváří ručně přes tabulku.

---

## 7. Tréninkové jednotky

Jednotky patří do skupiny a mají **přiřazené parametry** (délka + intenzita).

### Seed data — skupina BZ (Běh základní)

| Název | Popis | Pořadí | Parametry |
|-------|-------|--------|-----------|
| **BZ1** | Běh základní 1 | 1 | 20 km, tepy nízko (90–110) + tempo pomalé (6–7 min/km) |
| **BZ2** | Běh základní 2 | 2 | 10 km tepy nízko + 20 km tepy středně (110–150) + 10 km tempo střední (5–6 min/km) |
| **BZ3** | Běh základní 3 | 3 | 10 min tepy nízko + 20 km tepy středně + 10 min tepy nízko |

### Seed data — skupina BR (Běh rychlostní)

| Název | Popis | Pořadí | Parametry |
|-------|-------|--------|-----------|
| **BR1** | Běh rychlostní 1 | 3 | 10 min tepy vysoko (150–200) + 5 km tempo rychlé (4–5 min/km) |
| **BR2** | Běh rychlostní 2 | 2 | 20 min tepy vysoko |
| **BR3** | Běh rychlostní 3 | 1 | 30 min tepy vysoko |

### Detail parametrů jednotlivých jednotek (seed)

#### BZ1
| Délka | Jednotka | Parametr | MinLength |
|-------|----------|----------|-----------|
| 20 | km | Tepová frekvence nízko | ne |
| 20 | km | Tempo pomalé | ne |

#### BZ2
| Délka | Jednotka | Parametr | MinLength |
|-------|----------|----------|-----------|
| 10 | km | Tepová frekvence nízko | ne |
| 20 | km | Tepová frekvence středně | ne |
| 10 | km | Tempo střední | ne |

#### BZ3
| Délka | Jednotka | Parametr | MinLength |
|-------|----------|----------|-----------|
| 10 | min | Tepová frekvence nízko | ano |
| 20 | km | Tepová frekvence středně | ne |
| 10 | min | Tepová frekvence nízko | ano |

#### BR1
| Délka | Jednotka | Parametr | MinLength |
|-------|----------|----------|-----------|
| 10 | min | Tepová frekvence vysoko | ano |
| 5 | km | Tempo rychlé | ne |

#### BR2
| Délka | Jednotka | Parametr | MinLength |
|-------|----------|----------|-----------|
| 20 | min | Tepová frekvence vysoko | ano |

#### BR3
| Délka | Jednotka | Parametr | MinLength |
|-------|----------|----------|-----------|
| 30 | min | Tepová frekvence vysoko | ano |

> `MinLength = true` znamená, že hodnota je **minimální délka** (alespoň X minut), ne přesná délka.

---

## 8. Parametry — typy, definice a hodnoty

### 8.1 Globální typy parametrů (`parameter_types`)

| Typ | Popis | Jednotka |
|-----|-------|----------|
| **Rychlost** | Rychlost | km/h |
| **Tepy** | Tepová frekvence | tep/min |
| **Tempo** | Tempo běhu | min/km |

### 8.2 Trenérské definice parametrů (`trainer_parameters`)

Každý parametr patří k **sportu** a **typu**. Trenér si je definuje; seed obsahuje parametry trenéra `pepa`.

#### Běhání — Tepová frekvence

| Název | Popis | Typ |
|-------|-------|-----|
| Tepová frekvence nízko | Tepová frekvence nízko pro běh | Tepy |
| Tepová frekvence středně | Tepová frekvence střední pro běh | Tepy |
| Tepová frekvence vysoko | Tepová frekvence vysoká pro běh | Tepy |

#### Běhání — Tempo

| Název | Popis | Typ |
|-------|-------|-----|
| Tempo pomalé | Tempo pomalé pro běh | Tempo |
| Tempo střední | Tempo střední pro běh | Tempo |
| Tempo rychlé | Tempo rychlé pro běh | Tempo |

#### Cyklistika — Rychlost

| Název | Popis | Typ |
|-------|-------|-----|
| Rychlost nízko | Rychlost nízko pro kolo | Rychlost |
| Rychlost středně | Rychlost střední pro kolo | Rychlost |
| Rychlost vysoko | Rychlost vysoká pro kolo | Rychlost |

### 8.3 Aktuální hodnoty parametrů cvičence (`actual_user_parameters`)

Rozsahy hodnot, které trenér nastaví pro cvičence (seed pro trenéra pepa = vlastní referenční hodnoty):

#### Tepová frekvence (běh)

| Parametr | Dolní hodnota | Horní hodnota | Jednotka |
|----------|---------------|---------------|----------|
| Tepová frekvence nízko | 90 | 110 | tep/min |
| Tepová frekvence středně | 110 | 150 | tep/min |
| Tepová frekvence vysoko | 150 | 200 | tep/min |

#### Tempo (běh)

| Parametr | Dolní hodnota | Horní hodnota | Jednotka |
|----------|---------------|---------------|----------|
| Tempo pomalé | 6 | 7 | min/km |
| Tempo střední | 5 | 6 | min/km |
| Tempo rychlé | 4 | 5 | min/km |

#### Rychlost (kolo) — definováno, ale bez seed hodnot v `actual_user_parameters`

| Parametr | Doporučený rozsah | Jednotka |
|----------|-------------------|----------|
| Rychlost nízko | 15 – 20 | km/h |
| Rychlost středně | 20 – 28 | km/h |
| Rychlost vysoko | 28 – 35 | km/h |

### 8.4 Doporučené parametry pro další sporty

| Sport | Parametry k definici |
|-------|---------------------|
| Plavání | Tempo/100m (min/100m), Tepy, Délka série (m) |
| Silový trénink | Počet opakování, Váha (kg), Série, Odpočinek (s) |
| Běžky | Tepy, Tempo, Stoupání (m) |
| Chůze | Tepy, Tempo chůze (min/km), Vzdálenost (km) |
| Jóga | Délka pozice (min), Obtížnost (1–5) |
| SM systém | Délka cviku (min), Opakování, Série |

---

## 9. Jednotky délky a času

Globální katalog (`activity_training_param_units`):

| Název | Zkratka |
|-------|---------|
| Kilometer | km |
| Metr | m |
| Hodina | h |
| Minuta | min |
| Sekunda | s |

Použití v jednotkách tréninku: parametr `Length` + `LengthUnit` + volitelně `MinLength` (boolean).

---

## 10. Tréninkové plány (šablony a přiřazené)

### 10.1 Ukázková šablona (seed)

| Pole | Hodnota |
|------|---------|
| Název | Tréninkový plán pro běh |
| Popis | Tento plán je zaměřen na zlepšení běžeckých výkonů. |
| Délka cyklu | 7 dní (1 týden) |
| Počet cyklů | 4 týdny |
| Stav | Enabled |

#### Týdenní definice

| Týden | Název | Km | Čas (h) | Popis |
|-------|-------|-----|---------|-------|
| 1 | První týden | 20 | 20 | První týden tréninkového plánu |
| 2 | Druhý týden | 30 | 30 | Druhý týden tréninkového plánu |

#### Přiřazené aktivity v plánu

| Týden | Den v cyklu | Jednotka | Popis |
|-------|-------------|----------|-------|
| 1 | 1 (pondělí) | BZ1 | Název tréninku v plánu |
| 1 | 3 (středa) | BZ2 | Název tréninku v plánu |
| 2 | 1 (pondělí) | BZ3 | Název tréninku v plánu |

### 10.2 Přiřazený plán (pro cvičence)

Navíc oproti šabloně:

| Pole | Popis |
|------|-------|
| `userId` | ID cvičence |
| `trainerId` | ID trenéra |
| `dateTimeStart` | Datum prvního dne plánu (kalendář od tohoto data) |
| `sourceTemplateId` | Odkaz na šablonu (pokud kopírováno) |

### 10.3 Tréninkový deník

| Pole | Popis |
|------|-------|
| `assignActivityId` | Konkrétní trénink v kalendáři cvičence |
| `userId` | Cvičenec (autor poznámky) |
| `note` | Text poznámky |

---

## 11. Uživatelé a role

### Seed uživatelé

| Nick | Heslo | Role | Jméno | Email | Vztah |
|------|-------|------|-------|-------|-------|
| pepa | pepa | Trainer (20) | Pepa Novak | pepa@pepa.cz | Trenér |
| cvicenec1 | test | User (1) | Jan Novák | cvicenec1@test.cz | Cvičenec pepy |
| cvicenec2 | test | User (1) | Marie Svobodová | cvicenec2@test.cz | Cvičenec pepy |

### Role v systému

| Hodnota | Název | Popis |
|---------|-------|-------|
| 0 | Unverified | Po registraci, neověřený |
| 1 | User | Cvičenec |
| 2 | SubscriptionUser | Cvičenec s předplatným |
| 20 | Trainer | Trenér |
| 21 | SubscriptionTrainer | Trenér s předplatným |
| 1000 | Admin | Superuser |

### Avatar

- Index emoji avataru: **0–7** (uloženo v `profiles.avatar`)
- Zatím bez uploadu souboru

---

## 12. Doporučený obsah pro další sporty

Pro kompletní MVP nového projektu doporučujeme seedovat minimálně **běh** (hotovo ve zdroji) a připravit strukturu pro ostatní:

### Minimální seed (fáze 1)

- [x] 8 globálních sportů
- [x] 5 jednotek délky/času
- [x] 3 typy parametrů
- [x] Skupiny BZ + BR + 6 jednotek pro běh
- [x] 9 trenérských parametrů (6 běh + 3 kolo)
- [x] 6 aktuálních hodnot parametrů (běh)
- [x] 1 ukázková šablona plánu (4 týdny)
- [x] 3 testovací uživatelé

### Rozšířený seed (fáze 2) — doporučení

| Sport | Skupiny | Jednotky | Parametry |
|-------|---------|----------|-----------|
| Cyklistika | VZ, VR | VZ1–VZ3, VR1–VR2 | Rychlost nízko/středně/vysoko |
| Plavání | PZ, PR | PZ1–PZ2, PR1 | Tepy, Tempo/100m |
| Silový trénink | HK, SK | HK1, SK1, OP1 | Opakování, Váha |

---

## 13. Stránky s mock daty (co doplnit)

Tyto části ve zdrojovém projektu **nemají reálná data** — v novém projektu je implementovat:

### `/my-progress` (cvičenec)

Aktuálně statické karty:

| Karta | Mock hodnota | Co napojit |
|-------|--------------|------------|
| Celkový pokrok | 78 % | Poměr splněných tréninků / celkem |
| Tento týden | 3/4 | Tréninky tento týden |
| Dní v řadě | 12 | Počet po sobě jdoucích dnů s tréninkem |
| Úspěchy | 5 | Gamifikace (volitelné) |

Plánovaný obsah:
- Grafy pokroku v čase
- Historie tréninků
- Dosažené cíle
- Porovnání s předchozími obdobími
- Data z `actual_user_parameters` + historie

### `/my-training-plan` (cvičenec)

Napojit na `training_plan_user_assigns` — zobrazit aktivní plán přes `TraineeTrainingPlanView`.

### `/settings`

Placeholder — implementovat:
- Přepínání tématu (light/dark)
- Editace profilu
- Notifikace (volitelné)

---

## Příloha — Hierarchie dat (přehled)

```
SPORT (globální)
  └── SKUPINA (trenér, per sport)
        └── JEDNOTKA (trenér, per skupina)
              └── PARAMETR_ASSIGN (délka + parametr + jednotka)

PARAMETR_TYP (globální: Rychlost, Tepy, Tempo)
  └── TRENÉRSKÝ_PARAMETR (trenér, per sport)
        └── AKTUÁLNÍ_HODNOTA (cvičenec, rozsah lower–upper)

ŠABLONA_PLÁNU (trenér)
  └── TÝDEN (km, čas, popis)
        └── AKTIVITA_V_PLÁNU (den → jednotka)

PŘIŘAZENÝ_PLÁN (cvičenec + datum začátku)
  └── TÝDEN
        └── AKTIVITA
              └── POZNÁMKA_DENÍKU
```

---

*Dokument vytvořen: červen 2026*  
*Zdroje: `mts-fe/src/styles/theme.ts`, `Repository.cs`, `TrainingSportPage.tsx`, `SpaceUniverseTable.tsx`*
