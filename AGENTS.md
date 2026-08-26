# The Final Countdown — projektové poznámky

Vanilla SPA (`index.html` + `style.css` + `script.js` + `static-events.json`).
Živé súbory v `/workspace/public/` sú kópiou tohto projektu.

## Zlaté pravidlá

- Mobile first, chronologický zoznam vždy.
- Statické kalendáre sa editujú ručne v JSON; užívateľské udalosti v `localStorage`.
- `note` je voliteľné. Chýba / `null` / `""` → nič nerenderovať (žiadny pád).
- Farba názvu statickej udalosti = `color` skupiny. Neplatný/chýbajúci hex → sivá.
- Dátum, čas a zostáva u statických = sivé. U užívateľských = zelené (okrem karty Minulé).

## Plánované kroky (zatiaľ nerealizovať, kým to neschváli používateľ)

### Viac kalendárov

Samostatné skupiny v `static-events.json` (už je základ: `id`, `name`, `color`, `events`).

Ďalšie kalendáre v poradí:

1. **Špekulácie** — Grok 5, Claude, BTC $100k… (zatiaľ jedna časová bodka).
2. **Meniny** — opakované každý rok.
3. **Narodeniny** — opakované každý rok.
4. Ďalšie (F1 už existuje).

Každý kalendár má vlastné meno (zobrazuje sa namiesto „statická“) a vlastnú farbu.
Zapínanie/vypínanie: neskôr per-kalendár, dnes jeden checkbox „Statické udalosti“.

### Opakované udalosti

Plánovaný model (nerealizovať teraz): `repeat: "yearly" | "none"` + `month`/`day`,
rok sa dopočíta na aktuálny (`getFullYear()`), po polnoci dňa platnosti ide do Minulé
a ďalší ročník sa objaví až v novom roku (rovnaké pravidlo ako pri statických sviatkoch).

### Interval (od–do) — poznámka k diskusii

Zatiaľ **jedna bodka** (`date` + `time` + `timeZone`).

Ak pôjdeme do intervalu, bude to **globálne pre všetky kalendáre** (user aj static),
nie špeciálny prípad pre špekulácie. Otvorené otázky:

- Zobrazovať „prebieha“ medzi začiatkom a koncom (ako TERAZ! pri sviatkoch)?
- Do Minulé až po `end`, alebo hneď po `start`?
- All-day interval vs. presný čas na oboch koncoch?

### PWA vs. native (App Store / Play)

Cesta **web-first (PWA)** je správna, kým:

- stačí inštalácia na plochu (manifest + ikony + SW už sú),
- notifikácie môžu ísť **kým je stránka otvorená** (in-page toast / Notification API,
  model ako GitHub v tabe),
- dáta sú zatiaľ per-prehliadač (`localStorage`).

Native (Capacitor + store) až keď bude treba:

- push na zamknutý telefón (Background),
- zdieľanie dát medzi zariadeniami (vtedy hostovaná DB, napr. SQLite),
- tvOS / stále zapnutý iPad ako „domáci displej“ s fan-out notifikáciami.

Ďalšia debata: Web Notification pri otvorenej karte vs. Web Push + service worker.

## Schéma udalosti (aktuálna)

```json
{
  "id": "string",
  "name": "string",
  "date": "YYYY-MM-DD",
  "time": "HH:MM",
  "timeZone": "IANA",
  "note": "voliteľné, string; vynechať ak prázdne"
}
```

Statická skupina: `{ "id", "name", "color", "events": [ ... ] }`.
