# The Final Countdown — project notes

Vanilla SPA (`index.html` + `style.css` + `script.js` + `static-events.json`).
Live files in `/workspace/public/` are a copy of this project.

## Owner / agent workflow

- Reply to the owner **in Slovak**, regardless of the input language. Clarifying questions in Slovak too. All conversation with the owner is Slovak.
- If something is unclear, **ask**. Do not guess past a missing decision.
- Code comments, commit messages, README, AGENTS.md, and all project documentation are **English** (GitHub baseline).
- Never work directly on `main`. Always create a new branch from `main` and edit only on that branch.
- Never commit or push. After approved edits, only suggest a commit message.
- Stay inside this repository. Do not write outside the project (home directory, other folders, other repos).
- Do not implement the “planned steps” below until the owner approves them.

## Golden rules

- Mobile first, chronological list always.
- Static calendars are edited by hand in JSON; user events live in `localStorage`.
- Slovak namedays (`namedays-sk.json`) are a yearly lookup (month + day), not a countdown calendar. Show today + tomorrow under the header only.
- `note` is optional. Missing / `null` / `""` → render nothing (no crash).
- Static event title color = group `color`. Invalid or missing hex → grey.
- Date, time, and remaining for static events = grey. For user events = green (except the Past card).

## Planned steps (do not implement until the owner approves)

### More calendars

Separate groups in `static-events.json` (already: `id`, `name`, `color`, `events`).

Further calendars, in order:

1. **Speculation** — Grok 5, Claude, BTC $100k… (still a single time point).
2. **Name days** — yearly.
3. **Birthdays** — yearly.
4. Others (F1 already exists).

Each calendar has its own name (shown instead of “static”) and its own color.
Enable/disable: later per calendar; today one checkbox “Static events”.

### Repeating events

Planned model (not now): `repeat: "yearly" | "none"` + `month`/`day`,
year is derived (`getFullYear()`). After midnight of the valid day it moves to Past,
and the next year appears only in the new calendar year (same rule as static holidays).

### Interval (from–to) — discussion note

Still **one point** (`date` + `time` + `timeZone`).

If we add intervals, it will be **global for every calendar** (user and static),
not a special case for speculation. Open questions:

- Show “in progress” between start and end (like TERAZ! on holidays)?
- Move to Past only after `end`, or right after `start`?
- All-day interval vs exact time on both ends?

### PWA vs native (App Store / Play)

**Web-first (PWA)** is the right path while:

- home-screen install is enough (manifest + icons + SW already exist),
- notifications can run **while the page is open** (in-page toast / Notification API,
  GitHub-in-a-tab model),
- data is still per-browser (`localStorage`).

Native (Capacitor + store) only when we need:

- push on a locked phone (background),
- sharing data across devices (then a hosted DB, e.g. SQLite),
- tvOS / always-on iPad as a “house display” with fan-out notifications.

Later debate: Web Notification on an open tab vs Web Push + service worker.

## Event schema (current)

```json
{
  "id": "string",
  "name": "string",
  "date": "YYYY-MM-DD",
  "time": "HH:MM",
  "timeZone": "IANA",
  "note": "optional string; omit if empty"
}
```

Static group: `{ "id", "name", "color", "events": [ ... ] }`.
