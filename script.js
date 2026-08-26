(() => {
  const KEYS = {
    events: "tfc:events",
    timeFormat: "tfc:timeFormat",
    timezones: "tfc:timezones",
    showStatic: "tfc:showStatic",
  };
  const SCHEMA_VERSION = 1;
  const TZ_ALIASES = {
    cest: "Europe/Bratislava",
    cet: "Europe/Bratislava",
    bratislava: "Europe/Bratislava",
    slovakia: "Europe/Bratislava",
    slovensko: "Europe/Bratislava",
    praha: "Europe/Prague",
    prague: "Europe/Prague",
    vienna: "Europe/Vienna",
    wien: "Europe/Vienna",
    vieden: "Europe/Vienna",
    london: "Europe/London",
    utc: "UTC",
  };
  const FALLBACK_ZONES = [
    "UTC",
    "Europe/Bratislava",
    "Europe/Prague",
    "Europe/Vienna",
    "Europe/Budapest",
    "Europe/Warsaw",
    "Europe/Berlin",
    "Europe/Paris",
    "Europe/London",
    "Europe/Dublin",
    "Europe/Madrid",
    "Europe/Rome",
    "Europe/Amsterdam",
    "Europe/Zurich",
    "Europe/Stockholm",
    "Europe/Helsinki",
    "Europe/Athens",
    "Europe/Moscow",
    "America/New_York",
    "America/Chicago",
    "America/Denver",
    "America/Los_Angeles",
    "America/Toronto",
    "America/Sao_Paulo",
    "Asia/Tokyo",
    "Asia/Seoul",
    "Asia/Shanghai",
    "Asia/Singapore",
    "Asia/Dubai",
    "Asia/Kolkata",
    "Australia/Sydney",
    "Pacific/Auckland",
  ];

  const ICON = {
    hourglass:
      '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 3h10v2.2L13.2 12 17 18.8V21H7v-2.2L10.8 12 7 5.2V3Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M9 5h6M9 19h6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
    list: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    data: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3c4.4 0 8 1.6 8 3.5S16.4 10 12 10 4 8.4 4 6.5 7.6 3 12 3ZM20 12c0 1.9-3.6 3.5-8 3.5S4 13.9 4 12M20 17.5c0 1.9-3.6 3.5-8 3.5s-8-1.6-8-3.5" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>',
    pencil:
      '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 20h4L19.5 8.5a2.1 2.1 0 0 0-3-3L5 16.5V20Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M13.5 6.5l3 3" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
    trash:
      '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 7h16M9 7V5h6v2M7 7l1 13h8l1-13" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    down: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 4v12m0 0 5-5m-5 5-5-5M5 20h14" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    up: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 20V8m0 0 5 5m-5-5-5 5M5 4h14" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  };

  const TEMPLATE = `
    <div class="app" data-tfc-app>
      <div class="shell">
        <header class="top">
          <div class="brand-mark">${ICON.hourglass}</div>
          <div>
            <p class="brand-kicker">Živé odpočty</p>
            <h1 class="brand-title">The Final Countdown</h1>
          </div>
        </header>

        <nav class="tabbar" aria-label="Hlavná navigácia">
          <button type="button" class="tab" data-nav="list" aria-current="page">${ICON.list}<span>Odpočty</span></button>
          <button type="button" class="tab" data-nav="new">${ICON.plus}<span>Nová</span></button>
          <button type="button" class="tab" data-nav="data">${ICON.data}<span>Dáta</span></button>
        </nav>

        <section class="panel is-on" data-panel="list">
          <div class="subtabs" role="tablist" aria-label="Filter odpočtov">
            <button type="button" role="tab" data-sub="upcoming" aria-selected="true">Aktuálne</button>
            <button type="button" role="tab" data-sub="past" aria-selected="false">Minulé</button>
          </div>
          <div class="table-wrap" id="table-wrap">
            <table class="events">
              <caption>Zoznam udalostí</caption>
              <thead>
                <tr>
                  <th>Názov</th>
                  <th>Zostáva</th>
                  <th>Akcia</th>
                </tr>
              </thead>
              <tbody id="event-rows"></tbody>
            </table>
            <div class="empty" id="empty-state" hidden>
              <div class="empty-mark">${ICON.hourglass}</div>
              <h2 id="empty-title">Žiadne nadchádzajúce odpočty</h2>
              <p id="empty-copy">Pridaj udalosť s dátumom, časom a časovou zónou.</p>
              <button type="button" class="btn btn-primary" data-nav="new">${ICON.plus} Nová udalosť</button>
            </div>
          </div>
          <label class="static-toggle" id="static-toggle">
            <input type="checkbox" id="toggle-static">
            <span>Statické udalosti</span>
          </label>
        </section>

        <section class="panel" data-panel="new">
          <form class="form" id="event-form" novalidate autocomplete="off">
            <div class="form-head">
              <h2 class="brand-title" id="form-title" style="font-size:1.25rem">Nová udalosť</h2>
              <p id="form-lede">Povinný je názov, dátum, čas aj IANA zóna. Odpočet zohľadní letný čas zvolenej zóny.</p>
              <div class="field">
                <span class="field-label">Formát času pri zadávaní</span>
                <div class="seg" role="radiogroup" aria-label="Formát času">
                  <button type="button" role="radio" data-fmt="24" aria-checked="true">24h</button>
                  <button type="button" role="radio" data-fmt="12" aria-checked="false">12h</button>
                </div>
              </div>
            </div>
            <label class="field" data-field="name">
              <span class="field-label">Názov</span>
              <input id="f-name" name="name" maxlength="80" required placeholder="Kontrola u lekára">
              <span class="field-error"></span>
            </label>
            <label class="field" data-field="note">
              <span class="field-label">Poznámka <span class="optional">(nepovinné)</span></span>
              <textarea id="f-note" name="note" maxlength="200" rows="2" placeholder="Napr. volať na veterinu, či očkovanie platí"></textarea>
              <span class="field-error"></span>
            </label>
            <label class="field" data-field="date">
              <span class="field-label">Dátum</span>
              <input id="f-date" name="date" type="date" required>
              <span class="field-error"></span>
            </label>
            <div class="field" data-field="time">
              <span class="field-label">Čas</span>
              <div class="time-row" id="time-row">
                <input id="f-hour" inputmode="numeric" maxlength="2" aria-label="Hodina" placeholder="08">
                <span class="time-sep">:</span>
                <input id="f-minute" inputmode="numeric" maxlength="2" aria-label="Minúta" placeholder="00">
                <div class="seg ampm" id="ampm-wrap" hidden role="radiogroup" aria-label="AM alebo PM">
                  <button type="button" role="radio" data-ampm="AM" aria-checked="true">AM</button>
                  <button type="button" role="radio" data-ampm="PM" aria-checked="false">PM</button>
                </div>
              </div>
              <span class="field-error"></span>
            </div>
            <div class="field" data-field="tz">
              <span class="field-label">Časová zóna (IANA)</span>
              <div class="combo">
                <input id="f-tz" type="search" placeholder="Hľadať, napr. Bratislava" autocomplete="off" aria-autocomplete="list" aria-controls="tz-list">
                <ul class="combo-list" id="tz-list" hidden role="listbox"></ul>
              </div>
              <span class="field-error"></span>
            </div>
            <button type="submit" class="btn btn-primary btn-block" id="form-submit">Uložiť udalosť</button>
          </form>
        </section>

        <section class="panel" data-panel="data">
          <p class="lede" style="margin-bottom:16px">Export stiahne JSON s udalosťami tejto aplikácie. Import po kontrole prepíše uložený obsah.</p>
          <div class="data-grid">
            <article class="data-card">
              <h2>Export</h2>
              <p>Stiahne aktuálnu databázu z tohto prehliadača.</p>
              <div class="export-actions">
                <a class="btn btn-primary" id="btn-export" download="the-final-countdown.json" target="_blank" rel="noopener">${ICON.down} Stiahnuť JSON</a>
                <button type="button" class="btn btn-ghost" id="btn-copy-export">Kopírovať JSON</button>
              </div>
            </article>
            <article class="data-card">
              <h2>Import</h2>
              <p>Načíta súbor, overí schému a po potvrdení nahradí existujúce dáta.</p>
              <label class="btn btn-ghost file-btn">
                ${ICON.up} Vybrať JSON
                <input id="file-import" type="file" accept="application/json,.json">
              </label>
            </article>
          </div>
        </section>
      </div>

      <dialog class="modal" id="tfc-dialog" aria-labelledby="tfc-dialog-title">
        <form method="dialog" class="modal-card">
          <h2 id="tfc-dialog-title"></h2>
          <p id="tfc-dialog-body"></p>
          <div class="modal-actions" id="tfc-dialog-actions">
            <button value="cancel" class="btn btn-ghost" id="tfc-dialog-cancel">Zrušiť</button>
            <button value="confirm" class="btn btn-primary" id="tfc-dialog-confirm">Potvrdiť</button>
          </div>
        </form>
      </dialog>
      <dialog class="modal" id="tfc-export-dialog" aria-labelledby="tfc-export-title">
        <div class="modal-card">
          <h2 id="tfc-export-title">Uložiť JSON</h2>
          <p>Prehliadač v náhľade často zablokuje automatické stiahnutie. Použi odkaz alebo skopíruj obsah do schránky.</p>
          <div class="modal-actions is-stack">
            <a class="btn btn-primary" id="export-real-link" download="the-final-countdown.json" target="_blank" rel="noopener">Uložiť súbor</a>
            <button type="button" class="btn btn-ghost" id="btn-copy-json">Kopírovať JSON</button>
            <button type="button" class="btn btn-ghost" id="btn-close-export">Zavrieť</button>
          </div>
        </div>
      </dialog>
      <div class="toast" id="tfc-toast" role="status"></div>
    </div>
  `;

  const state = {
    root: null,
    view: "list",
    subtab: "upcoming",
    timeFormat: "24",
    ampm: "AM",
    selectedTz: "",
    tzHighlight: 0,
    events: [],
    staticEvents: [],
    showStatic: true,
    zones: [],
    ticker: null,
    toastTimer: null,
    dialogResolve: null,
    onDocClick: null,
    exportUrl: null,
    exportText: "",
    listYear: new Date().getFullYear(),
    editId: "",
    onHashChange: null,
    hashLock: false,
  };

  function $(sel, root = state.root) {
    return root.querySelector(sel);
  }

  function $all(sel, root = state.root) {
    return [...root.querySelectorAll(sel)];
  }

  function escapeHtml(value) {
    const map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return String(value).replace(/[&<>"']/g, (ch) => map[ch]);
  }

  function uid() {
    if (crypto.randomUUID) return crypto.randomUUID();
    return `tfc-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  }

  function readJson(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (raw == null) return fallback;
      return JSON.parse(raw);
    } catch {
      return fallback;
    }
  }

  function writeJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function loadEvents() {
    const data = readJson(KEYS.events, []);
    return Array.isArray(data) ? data : [];
  }

  function saveEvents(events) {
    writeJson(KEYS.events, events);
    state.events = events;
  }

  function loadTimeFormat() {
    return localStorage.getItem(KEYS.timeFormat) === "12" ? "12" : "24";
  }

  function saveTimeFormat(fmt) {
    state.timeFormat = fmt === "12" ? "12" : "24";
    localStorage.setItem(KEYS.timeFormat, state.timeFormat);
  }

  function isValidTimeZone(tz) {
    if (typeof tz !== "string" || !tz) return false;
    try {
      Intl.DateTimeFormat("en-US", { timeZone: tz }).format(new Date());
      return true;
    } catch {
      return false;
    }
  }

  function loadTimezones() {
    const cached = readJson(KEYS.timezones, null);
    if (Array.isArray(cached) && cached.length && cached.every((z) => typeof z === "string")) {
      return cached;
    }
    let list = [];
    try {
      if (typeof Intl.supportedValuesOf === "function") {
        list = Intl.supportedValuesOf("timeZone");
      }
    } catch {
      list = [];
    }
    if (!list.length) list = FALLBACK_ZONES.slice();
    writeJson(KEYS.timezones, list);
    return list;
  }

  function tzOffsetMs(instantMs, timeZone) {
    const date = new Date(instantMs);
    const parts = {};
    for (const part of new Intl.DateTimeFormat("en-US", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    }).formatToParts(date)) {
      if (part.type !== "literal") parts[part.type] = part.value;
    }
    const asUtc = Date.UTC(
      Number(parts.year),
      Number(parts.month) - 1,
      Number(parts.day),
      Number(parts.hour),
      Number(parts.minute),
      Number(parts.second),
    );
    return asUtc - instantMs;
  }

  function wallTimeToUtcMs(dateStr, timeStr, timeZone) {
    const [year, month, day] = dateStr.split("-").map(Number);
    const [hour, minute] = timeStr.split(":").map(Number);
    const wallAsUtc = Date.UTC(year, month - 1, day, hour, minute, 0);
    let instant = wallAsUtc;
    for (let i = 0; i < 3; i += 1) {
      instant = wallAsUtc - tzOffsetMs(instant, timeZone);
    }
    return instant;
  }

  function formatWall(instantMs, timeZone) {
    const parts = {};
    for (const part of new Intl.DateTimeFormat("en-US", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).formatToParts(new Date(instantMs))) {
      if (part.type !== "literal") parts[part.type] = part.value;
    }
    return {
      date: `${parts.year}-${parts.month}-${parts.day}`,
      time: `${parts.hour}:${parts.minute}`,
    };
  }

  function eventInstant(event) {
    return wallTimeToUtcMs(event.date, event.time, event.timeZone);
  }

  function nextIsoDate(dateStr) {
    const [year, month, day] = dateStr.split("-").map(Number);
    const next = new Date(Date.UTC(year, month - 1, day + 1));
    return `${next.getUTCFullYear()}-${pad2(next.getUTCMonth() + 1)}-${pad2(next.getUTCDate())}`;
  }

  function eventDayEndMs(event) {
    return wallTimeToUtcMs(nextIsoDate(event.date), "00:00", event.timeZone);
  }

  function isSafeColor(value) {
    return typeof value === "string" && /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value);
  }

  function eventPhase(event, now) {
    const start = eventInstant(event);
    if (event.static) {
      const until = eventDayEndMs(event);
      if (now >= until) return { phase: "past", at: start, until };
      if (now >= start) return { phase: "now", at: start, until };
      return { phase: "upcoming", at: start, until };
    }
    if (now >= start) return { phase: "past", at: start, until: start };
    return { phase: "upcoming", at: start, until: start };
  }

  function resolveInstant(dateStr, timeStr, timeZone) {
    if (!isValidTimeZone(timeZone)) {
      return { ok: false, error: "Neplatná IANA časová zóna." };
    }
    const ms = wallTimeToUtcMs(dateStr, timeStr, timeZone);
    const back = formatWall(ms, timeZone);
    if (back.date !== dateStr || back.time !== timeStr) {
      return {
        ok: false,
        error: "Tento čas v zvolenej zóne neexistuje (prechod na letný alebo zimný čas).",
      };
    }
    return { ok: true, ms };
  }

  function isValidIsoDate(iso) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
    if (!match) return false;
    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    if (month < 1 || month > 12 || day < 1 || day > 31) return false;
    const dt = new Date(Date.UTC(year, month - 1, day));
    return dt.getUTCFullYear() === year && dt.getUTCMonth() === month - 1 && dt.getUTCDate() === day;
  }

  function isValidTime(value) {
    const match = /^(\d{2}):(\d{2})$/.exec(value);
    if (!match) return false;
    const hour = Number(match[1]);
    const minute = Number(match[2]);
    return hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59;
  }

  function pad2(n) {
    return String(n).padStart(2, "0");
  }

  function plural(n, one, few, many) {
    const abs = Math.abs(n);
    const word = abs === 1 ? one : abs >= 2 && abs <= 4 ? few : many;
    return `${n} ${word}`;
  }

  function joinSk(parts) {
    if (!parts.length) return "0 sekúnd";
    if (parts.length === 1) return parts[0];
    if (parts.length === 2) return `${parts[0]} a ${parts[1]}`;
    return `${parts.slice(0, -1).join(", ")} a ${parts[parts.length - 1]}`;
  }

  function formatRemaining(deltaMs, live = false) {
    if (live) return "TERAZ!";
    const past = deltaMs <= 0;
    let seconds = Math.floor(Math.abs(deltaMs) / 1000);
    const days = Math.floor(seconds / 86400);
    seconds %= 86400;
    const hours = Math.floor(seconds / 3600);
    seconds %= 3600;
    const minutes = Math.floor(seconds / 60);
    seconds %= 60;
    const parts = [];
    if (days >= 1) {
      parts.push(plural(days, "deň", "dni", "dní"));
      parts.push(plural(hours, "hodina", "hodiny", "hodín"));
    } else {
      if (hours) parts.push(plural(hours, "hodina", "hodiny", "hodín"));
      parts.push(plural(minutes, "minúta", "minúty", "minút"));
      parts.push(plural(seconds, "sekunda", "sekundy", "sekúnd"));
    }
    const text = joinSk(parts);
    return past ? `+ ${text}` : text;
  }

  function formatEventWhen(event) {
    const when = `${event.date.split("-").reverse().join(".")} ${event.time}`;
    const tail = event.calendar || event.timeZone;
    return `${when} · ${tail}`;
  }

  function eventNote(event) {
    if (!event || typeof event.note !== "string") return "";
    return event.note.trim();
  }

  function todayInZone(timeZone) {
    return formatWall(Date.now(), timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone);
  }

  function setFieldError(name, message) {
    const field = $(`[data-field="${name}"]`);
    if (!field) return;
    field.classList.toggle("is-invalid", Boolean(message));
    const slot = field.querySelector(".field-error");
    if (slot) slot.textContent = message || "";
  }

  function clearErrors() {
    $all("[data-field]").forEach((field) => {
      field.classList.remove("is-invalid");
      const slot = field.querySelector(".field-error");
      if (slot) slot.textContent = "";
    });
  }

  function showToast(message) {
    const toast = $("#tfc-toast");
    toast.textContent = message;
    toast.classList.add("is-on");
    clearTimeout(state.toastTimer);
    state.toastTimer = setTimeout(() => toast.classList.remove("is-on"), 2400);
  }

  function openDialog({ title, body, confirmLabel = "Potvrdiť", cancelLabel = "Zrušiť", danger = false, alertOnly = false }) {
    const dialog = $("#tfc-dialog");
    $("#tfc-dialog-title").textContent = title;
    $("#tfc-dialog-body").textContent = body;
    const cancel = $("#tfc-dialog-cancel");
    const confirm = $("#tfc-dialog-confirm");
    const actions = $("#tfc-dialog-actions");
    cancel.hidden = alertOnly;
    cancel.textContent = cancelLabel;
    confirm.textContent = alertOnly ? "Rozumiem" : confirmLabel;
    confirm.className = `btn ${danger && !alertOnly ? "btn-danger" : "btn-primary"}`;
    actions.classList.toggle("is-single", alertOnly);
    dialog.showModal();
    return new Promise((resolve) => {
      const onClose = () => {
        dialog.removeEventListener("close", onClose);
        resolve(dialog.returnValue === "confirm");
      };
      dialog.addEventListener("close", onClose);
    });
  }

  function filteredZones(query) {
    const q = query.trim().toLowerCase().replace(/\s+/g, "_");
    if (!q) return state.zones.slice(0, 12);
    const alias = TZ_ALIASES[q];
    const out = [];
    if (alias && state.zones.includes(alias)) out.push(alias);
    for (const zone of state.zones) {
      if (zone === alias) continue;
      const hay = zone.toLowerCase();
      if (hay.includes(q) || hay.replace(/_/g, " ").includes(query.trim().toLowerCase())) {
        out.push(zone);
      }
      if (out.length >= 12) break;
    }
    return out;
  }

  function renderTzList() {
    const list = $("#tz-list");
    const input = $("#f-tz");
    const items = filteredZones(input.value);
    list.innerHTML = items
      .map(
        (zone, index) =>
          `<li><button type="button" role="option" data-tz="${escapeHtml(zone)}" aria-selected="${index === state.tzHighlight ? "true" : "false"}">${escapeHtml(zone.replace(/_/g, " "))}</button></li>`,
      )
      .join("");
    list.hidden = items.length === 0;
    if (state.tzHighlight >= items.length) state.tzHighlight = 0;
  }

  function selectZone(zone) {
    state.selectedTz = zone;
    $("#f-tz").value = zone;
    $("#tz-list").hidden = true;
    setFieldError("tz", "");
  }

  function convertHourFields(from, to) {
    if (from === to) return;
    const hourEl = $("#f-hour");
    let hour = Number(hourEl.value);
    if (!Number.isFinite(hour)) return;
    if (from === "24" && to === "12") {
      state.ampm = hour >= 12 ? "PM" : "AM";
      hourEl.value = String(hour % 12 === 0 ? 12 : hour % 12);
      $all("[data-ampm]").forEach((btn) => {
        btn.setAttribute("aria-checked", btn.dataset.ampm === state.ampm ? "true" : "false");
      });
    } else if (from === "12" && to === "24") {
      if (hour === 12) hour = state.ampm === "AM" ? 0 : 12;
      else if (state.ampm === "PM") hour += 12;
      hourEl.value = pad2(hour);
    }
  }

  function applyTimeFormatUi() {
    const is12 = state.timeFormat === "12";
    $all("[data-fmt]").forEach((btn) => {
      btn.setAttribute("aria-checked", btn.dataset.fmt === state.timeFormat ? "true" : "false");
    });
    $("#ampm-wrap").hidden = !is12;
    $("#time-row").classList.toggle("is-12", is12);
    $("#f-hour").placeholder = is12 ? "8" : "08";
    $("#f-hour").setAttribute("aria-label", is12 ? "Hodina (1–12)" : "Hodina (0–23)");
  }

  function readTimeFromForm() {
    const hourRaw = $("#f-hour").value.trim();
    const minuteRaw = $("#f-minute").value.trim();
    if (hourRaw === "" || minuteRaw === "") {
      return { ok: false, error: "Zadaj hodinu aj minútu." };
    }
    if (!/^\d{1,2}$/.test(hourRaw) || !/^\d{1,2}$/.test(minuteRaw)) {
      return { ok: false, error: "Čas musí byť číslo." };
    }
    let hour = Number(hourRaw);
    const minute = Number(minuteRaw);
    if (minute < 0 || minute > 59) return { ok: false, error: "Minúta musí byť 0 až 59." };
    if (state.timeFormat === "12") {
      if (hour < 1 || hour > 12) return { ok: false, error: "Hodina v 12h formáte je 1 až 12." };
      if (hour === 12) hour = state.ampm === "AM" ? 0 : 12;
      else if (state.ampm === "PM") hour += 12;
    } else if (hour < 0 || hour > 23) {
      return { ok: false, error: "Hodina v 24h formáte je 0 až 23." };
    }
    return { ok: true, time: `${pad2(hour)}:${pad2(minute)}` };
  }

  function listedEvents() {
    const year = String(new Date().getFullYear());
    const statics = state.showStatic
      ? state.staticEvents.filter((event) => String(event.date).startsWith(year))
      : [];
    return state.events.concat(statics);
  }

  function visibleEvents(now) {
    const upcoming = state.subtab === "upcoming";
    const rows = listedEvents()
      .map((event) => ({ event, ...eventPhase(event, now) }))
      .filter(({ phase }) => (upcoming ? phase !== "past" : phase === "past"));
    rows.sort((a, b) => {
      if (upcoming) return a.at - b.at;
      return b.until - a.until;
    });
    return rows;
  }

  function renderList() {
    syncStaticToggle();
    const now = Date.now();
    const rows = visibleEvents(now);
    const tbody = $("#event-rows");
    const empty = $("#empty-state");
    const table = tbody.closest("table");
    table.classList.toggle("is-past-view", state.subtab === "past");
    $all("[data-sub]").forEach((btn) => {
      btn.setAttribute("aria-selected", btn.dataset.sub === state.subtab ? "true" : "false");
    });
    if (!rows.length) {
      table.hidden = true;
      empty.hidden = false;
      $("#empty-title").textContent =
        state.subtab === "past" ? "Žiadne minulé udalosti" : "Žiadne nadchádzajúce odpočty";
      $("#empty-copy").textContent =
        state.subtab === "past"
          ? "Keď odpočet dobehne na nulu, udalosť sa presunie sem a čas pobeží nahor."
          : "Pridaj udalosť s dátumom, časom a časovou zónou.";
      empty.querySelector("[data-nav='new']").hidden = state.subtab === "past";
      tbody.innerHTML = "";
      return;
    }
    table.hidden = false;
    empty.hidden = true;
    tbody.innerHTML = rows
      .map(({ event, at, phase }) => {
        const isStatic = Boolean(event.static);
        const live = phase === "now";
        const past = phase === "past";
        const nameColor = isStatic && isSafeColor(event.color) ? event.color : "";
        const nameStyle = nameColor ? ` style="color:${nameColor}"` : "";
        const action = isStatic
          ? `<span class="static-tag">${escapeHtml(event.calendar || "Statická")}</span>`
          : `<div class="row-actions">
              <button type="button" class="btn btn-ghost btn-icon" data-edit="${escapeHtml(event.id)}" aria-label="Upraviť">${ICON.pencil}</button>
              <button type="button" class="btn btn-danger btn-icon" data-delete="${escapeHtml(event.id)}" aria-label="Vymazať">${ICON.trash}</button>
            </div>`;
        return `<tr data-id="${escapeHtml(event.id)}" class="${isStatic ? "is-static" : "is-user"}">
          <td data-col="name">
            <span class="event-name"${nameStyle}>${escapeHtml(event.name)}</span>
            ${eventNote(event) ? `<span class="event-note">${escapeHtml(eventNote(event))}</span>` : ""}
            <span class="event-meta">${escapeHtml(formatEventWhen(event))}</span>
          </td>
          <td data-col="remain">
            <span class="remain ${past ? "is-past" : ""} ${live ? "is-now" : ""}" data-remain="${escapeHtml(event.id)}">${escapeHtml(formatRemaining(at - now, live))}</span>
          </td>
          <td data-col="action">
            ${action}
          </td>
        </tr>`;
      })
      .join("");
  }

  function tick() {
    if (state.view !== "list") return;
    const now = Date.now();
    const remainNodes = $all("[data-remain]");
    if (!remainNodes.length) {
      renderList();
      return;
    }
    const year = new Date().getFullYear();
    if (state.listYear !== year) {
      state.listYear = year;
      renderList();
      return;
    }
    let crossed = false;
    remainNodes.forEach((node) => {
      const event = listedEvents().find((item) => item.id === node.dataset.remain);
      if (!event) return;
      const info = eventPhase(event, now);
      if ((state.subtab === "upcoming" && info.phase === "past") || (state.subtab === "past" && info.phase !== "past")) {
        crossed = true;
      }
      node.textContent = formatRemaining(info.at - now, info.phase === "now");
      node.classList.toggle("is-past", info.phase === "past");
      node.classList.toggle("is-now", info.phase === "now");
    });
    if (crossed) renderList();
  }

  function parseHash() {
    const raw = decodeURIComponent((location.hash || "").replace(/^#/, "").trim());
    if (!raw || raw === "odpocty" || raw === "list") return { view: "list", editId: "" };
    if (raw === "data") return { view: "data", editId: "" };
    if (raw === "nova" || raw === "new") return { view: "new", editId: "" };
    if (raw.startsWith("nova/")) return { view: "new", editId: raw.slice(5) };
    return { view: "list", editId: "" };
  }

  function hashFor(view, editId) {
    if (view === "new") return editId ? `#nova/${encodeURIComponent(editId)}` : "#nova";
    if (view === "data") return "#data";
    return "#odpocty";
  }

  function writeHash(view, editId, push) {
    const hash = hashFor(view, editId);
    if (location.hash === hash) return;
    state.hashLock = true;
    if (push) history.pushState(null, "", hash);
    else history.replaceState(null, "", hash);
    queueMicrotask(() => {
      state.hashLock = false;
    });
  }

  function paintView(view) {
    state.view = view;
    $all("[data-panel]").forEach((panel) => {
      panel.classList.toggle("is-on", panel.dataset.panel === view);
    });
    $all(".tabbar [data-nav]").forEach((btn) => {
      btn.setAttribute("aria-current", btn.dataset.nav === view ? "page" : "false");
    });
    if (view === "list") renderList();
    if (view === "data") prepareExportLink();
  }

  function fillFormFromEvent(event) {
    clearErrors();
    $("#f-name").value = event.name;
    const noteField = $("#f-note");
    if (noteField) noteField.value = eventNote(event);
    $("#f-date").value = event.date;
    const [hour, minute] = event.time.split(":").map(Number);
    if (state.timeFormat === "12") {
      state.ampm = hour >= 12 ? "PM" : "AM";
      $("#f-hour").value = String(hour % 12 === 0 ? 12 : hour % 12);
      $all("[data-ampm]").forEach((btn) => {
        btn.setAttribute("aria-checked", btn.dataset.ampm === state.ampm ? "true" : "false");
      });
    } else {
      $("#f-hour").value = pad2(hour);
    }
    $("#f-minute").value = pad2(minute);
    selectZone(event.timeZone);
    applyTimeFormatUi();
  }

  function applyFormMode() {
    const editing = state.editId ? state.events.find((item) => item.id === state.editId) : null;
    $("#form-title").textContent = editing ? "Upraviť udalosť" : "Nová udalosť";
    $("#form-lede").textContent = editing
      ? "Uprav názov, dátum, čas alebo zónu. Odpočet sa prepočíta."
      : "Povinný je názov, dátum, čas aj IANA zóna. Odpočet zohľadní letný čas zvolenej zóny.";
    $("#form-submit").textContent = editing ? "Uložiť zmeny" : "Uložiť udalosť";
    if (editing) fillFormFromEvent(editing);
  }

  function showView(view, opts = {}) {
    const wantedId = view === "new" ? String(opts.editId || "") : "";
    if (view === "new" && wantedId) {
      const found = state.events.find((item) => item.id === wantedId && !item.static);
      if (!found) {
        state.editId = "";
        writeHash("new", "", false);
        paintView("new");
        $("#event-form").reset();
        defaultFormValues();
        applyFormMode();
        showToast("Udalosť sa nenašla, vytváraš novú.");
        return;
      }
      state.editId = found.id;
    } else {
      if (view === "new") {
        $("#event-form").reset();
        defaultFormValues();
      }
      state.editId = "";
    }
    writeHash(view, state.editId, Boolean(opts.push));
    paintView(view);
    if (view === "new") applyFormMode();
  }

  function onHashChange() {
    if (state.hashLock) return;
    const parsed = parseHash();
    if (parsed.view === state.view && parsed.editId === (state.editId || "")) return;
    showView(parsed.view, { editId: parsed.editId });
  }

  function defaultFormValues() {
    const zone = state.selectedTz || Intl.DateTimeFormat().resolvedOptions().timeZone || "Europe/Bratislava";
    state.selectedTz = zone;
    const wall = todayInZone(zone);
    $("#f-date").value = wall.date;
    const [hour, minute] = wall.time.split(":").map(Number);
    if (state.timeFormat === "12") {
      const ampm = hour >= 12 ? "PM" : "AM";
      state.ampm = ampm;
      const h12 = hour % 12 === 0 ? 12 : hour % 12;
      $("#f-hour").value = String(h12);
      $all("[data-ampm]").forEach((btn) => {
        btn.setAttribute("aria-checked", btn.dataset.ampm === ampm ? "true" : "false");
      });
    } else {
      $("#f-hour").value = pad2(hour);
    }
    $("#f-minute").value = pad2(minute);
    $("#f-tz").value = zone;
  }

  async function onDelete(id) {
    const event = state.events.find((item) => item.id === id);
    if (!event || event.static) return;
    const ok = await openDialog({
      title: "Vymazať udalosť?",
      body: `Naozaj vymazať „${event.name}“? Túto akciu nevieš vrátiť.`,
      confirmLabel: "Vymazať",
      danger: true,
    });
    if (!ok) return;
    saveEvents(state.events.filter((item) => item.id !== id));
    if (state.editId === id) {
      state.editId = "";
      showView("list");
    } else {
      renderList();
    }
    showToast("Udalosť bola vymazaná.");
  }

  function validateForm() {
    clearErrors();
    let valid = true;
    const name = $("#f-name").value.trim();
    if (!name) {
      setFieldError("name", "Názov je povinný.");
      valid = false;
    } else if (name.length > 80) {
      setFieldError("name", "Názov môže mať najviac 80 znakov.");
      valid = false;
    }
    const noteField = $("#f-note");
    const note = eventNote({ note: noteField ? noteField.value : "" });
    if (noteField && noteField.value && noteField.value.length > 200) {
      setFieldError("note", "Poznámka môže mať najviac 200 znakov.");
      valid = false;
    }
    const date = $("#f-date").value;
    if (!date || !isValidIsoDate(date)) {
      setFieldError("date", "Zadaj platný dátum.");
      valid = false;
    }
    const time = readTimeFromForm();
    if (!time.ok) {
      setFieldError("time", time.error);
      valid = false;
    }
    const zone = state.selectedTz || $("#f-tz").value.trim();
    if (!zone || !isValidTimeZone(zone)) {
      setFieldError("tz", "Vyber platnú IANA zónu zo zoznamu.");
      valid = false;
    } else if (!state.zones.includes(zone) && isValidTimeZone(zone)) {
      state.zones.push(zone);
      writeJson(KEYS.timezones, state.zones);
      state.selectedTz = zone;
    } else {
      state.selectedTz = zone;
    }
    if (!valid || !time.ok) return null;
    const instant = resolveInstant(date, time.time, state.selectedTz);
    if (!instant.ok) {
      setFieldError("time", instant.error);
      return null;
    }
    const editing = state.editId ? state.events.find((item) => item.id === state.editId) : null;
    const payload = {
      id: editing ? editing.id : uid(),
      name,
      date,
      time: time.time,
      timeZone: state.selectedTz,
      createdAt: editing && editing.createdAt ? editing.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    if (note) payload.note = note;
    return payload;
  }

  function onSubmit(event) {
    event.preventDefault();
    const payload = validateForm();
    if (!payload) return;
    const editing = Boolean(state.editId);
    if (editing) {
      saveEvents(state.events.map((item) => (item.id === payload.id ? payload : item)));
    } else {
      saveEvents([...state.events, payload]);
    }
    $("#event-form").reset();
    defaultFormValues();
    state.editId = "";
    state.subtab = "upcoming";
    showView("list");
    showToast(editing ? "Udalosť bola upravená." : "Udalosť bola uložená.");
  }

  function buildExportText() {
    return JSON.stringify(
      {
        version: SCHEMA_VERSION,
        exportedAt: new Date().toISOString(),
        timeFormat: state.timeFormat,
        events: state.events,
      },
      null,
      2,
    );
  }

  function inEmbeddedFrame() {
    try {
      return window.self !== window.top;
    } catch {
      return true;
    }
  }

  function revokeExportUrl() {
    if (state.exportUrl && state.exportUrl.startsWith("blob:")) {
      URL.revokeObjectURL(state.exportUrl);
    }
    state.exportUrl = null;
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      const area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.left = "-9999px";
      document.body.appendChild(area);
      area.select();
      const ok = document.execCommand("copy");
      area.remove();
      return ok;
    }
  }

  function prepareExportLink() {
    const filename = "the-final-countdown.json";
    const text = buildExportText();
    const blob = new Blob([text], { type: "application/json;charset=utf-8" });
    revokeExportUrl();
    const url = URL.createObjectURL(blob);
    state.exportUrl = url;
    state.exportText = text;
    const main = $("#btn-export");
    main.href = url;
    main.setAttribute("download", filename);
    main.setAttribute("target", "_blank");
    main.setAttribute("rel", "noopener");
    const real = $("#export-real-link");
    if (real) {
      real.href = url;
      real.setAttribute("download", filename);
    }
    return { url, text, filename, blob };
  }

  function onExportClick() {
    if (!state.exportUrl) prepareExportLink();
    if (inEmbeddedFrame()) {
      setTimeout(() => {
        const dlg = $("#tfc-export-dialog");
        if (dlg && !dlg.open) dlg.showModal();
      }, 400);
      return;
    }
    showToast("JSON sa ukladá…");
  }

  function validateImport(data) {
    const errors = [];
    if (!data || typeof data !== "object" || Array.isArray(data)) {
      return { ok: false, errors: ["Súbor musí obsahovať JSON objekt."] };
    }
    if (data.version !== SCHEMA_VERSION && data.version !== String(SCHEMA_VERSION)) {
      errors.push("Neznáma verzia schémy (očakáva sa version: 1).");
    }
    if (data.timeFormat != null && data.timeFormat !== "12" && data.timeFormat !== "24") {
      errors.push('Pole timeFormat musí byť "12" alebo "24".');
    }
    if (!Array.isArray(data.events)) {
      errors.push('Chýba pole "events".');
      return { ok: false, errors };
    }
    const seen = new Set();
    const events = [];
    data.events.forEach((item, index) => {
      const label = `Udalosť ${index + 1}`;
      if (!item || typeof item !== "object" || Array.isArray(item)) {
        errors.push(`${label}: nie je objekt.`);
        return;
      }
      if (typeof item.name !== "string" || !item.name.trim()) {
        errors.push(`${label}: chýba názov.`);
      }
      if (!isValidIsoDate(item.date)) errors.push(`${label}: neplatný dátum.`);
      if (!isValidTime(item.time)) errors.push(`${label}: neplatný čas.`);
      if (!isValidTimeZone(item.timeZone)) {
        errors.push(`${label}: neplatná časová zóna.`);
      } else if (isValidIsoDate(item.date) && isValidTime(item.time)) {
        const resolved = resolveInstant(item.date, item.time, item.timeZone);
        if (!resolved.ok) errors.push(`${label}: ${resolved.error}`);
      }
      let id = typeof item.id === "string" && item.id.trim() ? item.id : uid();
      if (seen.has(id)) id = uid();
      seen.add(id);
      const imported = {
        id,
        name: String(item.name || "").trim(),
        date: item.date,
        time: item.time,
        timeZone: item.timeZone,
        createdAt: typeof item.createdAt === "string" ? item.createdAt : new Date().toISOString(),
      };
      const importedNote = eventNote(item);
      if (importedNote) imported.note = importedNote.slice(0, 200);
      events.push(imported);
    });
    if (errors.length) return { ok: false, errors };
    return { ok: true, events, timeFormat: data.timeFormat === "12" || data.timeFormat === "24" ? data.timeFormat : null };
  }

  async function onImportFile(file) {
    if (!file) return;
    let parsed;
    try {
      parsed = JSON.parse(await file.text());
    } catch {
      await openDialog({
        title: "Import zlyhal",
        body: "Súbor nie je platný JSON.",
        alertOnly: true,
      });
      return;
    }
    const result = validateImport(parsed);
    if (!result.ok) {
      await openDialog({
        title: "Import zlyhal",
        body: result.errors.slice(0, 8).join("\n"),
        alertOnly: true,
      });
      return;
    }
    if (state.events.length) {
      const ok = await openDialog({
        title: "Prepísať existujúci obsah?",
        body: `Aktuálne máš ${state.events.length} ${state.events.length === 1 ? "udalosť" : state.events.length < 5 ? "udalosti" : "udalostí"}. Import ich všetky nahradí.`,
        confirmLabel: "Prepísať",
        danger: true,
      });
      if (!ok) return;
    }
    saveEvents(result.events);
    if (result.timeFormat) {
      saveTimeFormat(result.timeFormat);
      applyTimeFormatUi();
    }
    state.subtab = "upcoming";
    showView("list");
    showToast(`Importovaných udalostí: ${result.events.length}.`);
  }

  function bind() {
    $all("[data-nav]").forEach((btn) => {
      btn.addEventListener("click", () => showView(btn.dataset.nav));
    });
    $all("[data-sub]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.subtab = btn.dataset.sub;
        renderList();
      });
    });
    const staticToggle = $("#toggle-static");
    if (staticToggle) {
      staticToggle.checked = state.showStatic;
      staticToggle.addEventListener("change", () => {
        state.showStatic = staticToggle.checked;
        localStorage.setItem(KEYS.showStatic, state.showStatic ? "1" : "0");
        renderList();
      });
    }
    $all("[data-fmt]").forEach((btn) => {
      btn.addEventListener("click", () => {
        convertHourFields(state.timeFormat, btn.dataset.fmt);
        saveTimeFormat(btn.dataset.fmt);
        applyTimeFormatUi();
      });
    });
    $all("[data-ampm]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.ampm = btn.dataset.ampm;
        $all("[data-ampm]").forEach((item) => {
          item.setAttribute("aria-checked", item.dataset.ampm === state.ampm ? "true" : "false");
        });
      });
    });
    $("#event-form").addEventListener("submit", onSubmit);
    $("#event-rows").addEventListener("click", (event) => {
      const target = event.target instanceof Element ? event.target : event.target.parentElement;
      if (!target) return;
      const editBtn = target.closest("[data-edit]");
      if (editBtn) {
        showView("new", { editId: editBtn.dataset.edit, push: true });
        return;
      }
      const delBtn = target.closest("[data-delete]");
      if (delBtn) onDelete(delBtn.dataset.delete);
    });
    $("#btn-export").addEventListener("click", onExportClick);
    $("#btn-copy-export").addEventListener("click", async () => {
      prepareExportLink();
      const ok = await copyText(state.exportText);
      showToast(ok ? "JSON je v schránke." : "Kopírovanie sa nepodarilo.");
    });
    $("#btn-copy-json").addEventListener("click", async () => {
      const ok = await copyText(state.exportText || buildExportText());
      showToast(ok ? "JSON je v schránke." : "Kopírovanie sa nepodarilo.");
    });
    $("#btn-close-export").addEventListener("click", () => {
      $("#tfc-export-dialog").close();
    });
    $("#tfc-export-dialog").addEventListener("close", () => {});
    $("#export-real-link").addEventListener("click", () => {
      showToast("Súbor sa ukladá…");
      $("#tfc-export-dialog").close();
    });
    $("#file-import").addEventListener("change", (event) => {
      const file = event.target.files && event.target.files[0];
      onImportFile(file).finally(() => {
        event.target.value = "";
      });
    });
    const tzInput = $("#f-tz");
    tzInput.addEventListener("focus", () => renderTzList());
    tzInput.addEventListener("input", () => {
      state.selectedTz = "";
      state.tzHighlight = 0;
      renderTzList();
    });
    tzInput.addEventListener("keydown", (event) => {
      const items = filteredZones(tzInput.value);
      if (event.key === "ArrowDown") {
        event.preventDefault();
        state.tzHighlight = Math.min(state.tzHighlight + 1, Math.max(items.length - 1, 0));
        renderTzList();
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        state.tzHighlight = Math.max(state.tzHighlight - 1, 0);
        renderTzList();
      } else if (event.key === "Enter") {
        if (!$("#tz-list").hidden && items[state.tzHighlight]) {
          event.preventDefault();
          selectZone(items[state.tzHighlight]);
        }
      } else if (event.key === "Escape") {
        $("#tz-list").hidden = true;
      }
    });
    $("#tz-list").addEventListener("mousedown", (event) => {
      const btn = event.target.closest("[data-tz]");
      if (btn) {
        event.preventDefault();
        selectZone(btn.dataset.tz);
      }
    });
    if (state.onDocClick) document.removeEventListener("click", state.onDocClick);
    state.onDocClick = (event) => {
      const target = event.target instanceof Element ? event.target : event.target.parentElement;
      if (!target || !target.closest(".combo")) {
        const list = document.getElementById("tz-list");
        if (list) list.hidden = true;
      }
    };
    document.addEventListener("click", state.onDocClick);
    if (state.onHashChange) window.removeEventListener("hashchange", state.onHashChange);
    state.onHashChange = onHashChange;
    window.addEventListener("hashchange", state.onHashChange);
  }

  function startTicker() {
    if (state.ticker) clearInterval(state.ticker);
    state.ticker = setInterval(tick, 1000);
  }

  function registerSw() {
    if (!("serviceWorker" in navigator)) return;
    const devPort = location.port === "8080" || location.port === "8081";
    if (devPort || inEmbeddedFrame()) {
      navigator.serviceWorker.getRegistrations().then((regs) => {
        regs.forEach((reg) => reg.unregister());
      });
      return;
    }
    navigator.serviceWorker.register("/service-worker.js").catch(() => {});
  }

  const SEED_EVENTS = [
    {
      id: "user-lekar-2027-01-19",
      name: "Kontrola u lekára",
      date: "2027-01-19",
      time: "08:30",
      timeZone: "Europe/Bratislava",
    },
    {
      id: "user-gta6-netflix-2026-08-27",
      name: "GTA 6: Netflix odhalenie",
      date: "2026-08-27",
      time: "15:00",
      timeZone: "America/New_York",
      note: "U nás 21:00 CEST. YouTube o 6 hodín neskôr.",
    },
  ];

  function ensureSeedEvents() {
    let events = state.events.slice();
    let changed = false;
    SEED_EVENTS.forEach((seed) => {
      const index = events.findIndex((event) => event.id === seed.id);
      if (index === -1) {
        events.push({ ...seed, createdAt: new Date().toISOString() });
        changed = true;
        return;
      }
      if (seed.note && !eventNote(events[index])) {
        events[index] = { ...events[index], note: seed.note };
        changed = true;
      }
    });
    if (changed) saveEvents(events);
  }

  function loadShowStatic() {
    const raw = localStorage.getItem(KEYS.showStatic);
    return raw == null ? true : raw === "1" || raw === "true";
  }

  function normalizeStaticPayload(data) {
    if (!data || typeof data !== "object") return [];
    const groups = data.staticEvents || data["static-events"] || [];
    if (!Array.isArray(groups)) return [];
    const out = [];
    groups.forEach((group, gi) => {
      if (!group || typeof group !== "object") return;
      const calendarName = String(group.name || group.Name || "Statické udalosti");
      const calendarId = String(group.id || `cal-${gi}`);
      const colorRaw = group.color || group.Color || "";
      const color = isSafeColor(colorRaw) ? colorRaw : "";
      const items = group.events || group.Data || [];
      if (!Array.isArray(items)) return;
      items.forEach((item, index) => {
        if (!item || typeof item !== "object") return;
        const date = item.date || item.Date;
        const time = item.time || item.Time || "00:00";
        const timeZone = item.timeZone || item.TimeZone || "Europe/Bratislava";
        const name = String(item.name || item.Name || calendarName).trim();
        if (!name || !isValidIsoDate(date) || !isValidTime(time) || !isValidTimeZone(timeZone)) return;
        const note = eventNote({ note: item.note != null ? item.note : item.Note });
        const row = {
          id: String(item.id || `static:${calendarId}:${date}:${index}`),
          name,
          date,
          time,
          timeZone,
          calendar: calendarName,
          color,
          static: true,
        };
        if (note) row.note = note;
        out.push(row);
      });
    });
    return out;
  }

  async function loadStaticEvents() {
    const urls = ["/static-events.json?v=tfc8", "static-events.json?v=tfc8"];
    for (const url of urls) {
      try {
        const res = await fetch(url, { cache: "reload" });
        if (!res.ok) continue;
        return normalizeStaticPayload(await res.json());
      } catch {
        /* try next */
      }
    }
    return [];
  }

  function syncStaticToggle() {
    const input = $("#toggle-static");
    if (input) input.checked = state.showStatic;
  }

  function mount(root) {
    if (!root) return;
    if (state.ticker) clearInterval(state.ticker);
    if (state.onDocClick) document.removeEventListener("click", state.onDocClick);
    if (state.onHashChange) window.removeEventListener("hashchange", state.onHashChange);
    state.root = root;
    state.zones = loadTimezones();
    state.events = loadEvents();
    ensureSeedEvents();
    state.showStatic = loadShowStatic();
    state.staticEvents = [];
    state.timeFormat = loadTimeFormat();
    state.selectedTz = Intl.DateTimeFormat().resolvedOptions().timeZone || "Europe/Bratislava";
    if (!isValidTimeZone(state.selectedTz)) state.selectedTz = "Europe/Bratislava";
    root.innerHTML = TEMPLATE;
    bind();
    applyTimeFormatUi();
    defaultFormValues();
    {
      const parsed = parseHash();
      showView(parsed.view, { editId: parsed.editId });
    }
    startTicker();
    registerSw();
    loadStaticEvents().then((events) => {
      state.staticEvents = events;
      syncStaticToggle();
      if (state.view === "list") renderList();
    });
  }

  window.TFC = { mount };

  const boot = () => {
    const el = document.getElementById("tfc-root");
    if (el) mount(el);
  };
  const current = document.currentScript;
  const fromReact = Boolean(current && current.dataset && current.dataset.tfc === "1");
  if (!fromReact) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
    else boot();
  }
})();
