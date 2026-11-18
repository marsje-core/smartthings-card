// SPDX-License-Identifier: LGPL-3.0-or-later
/*
 * Samsung washer, dryer, and oven exposed by the SmartThings or LocalThings
 * integration. Tile on the dashboard, more-info style dialog with the
 * essential controls.
 *
 *   type: custom:samsung-appliance-card
 *   device_id: <device id>        # or: entity: <any entity of the appliance>
 *   name: Lavatrice               # optional
 */

const VERSION = "1.2.2";

// Entities are found by translation_key, entity_ids differ per device.
const ROLES = {
  "sensor.washer_machine_state": "machineState",
  "sensor.dryer_machine_state": "machineState",
  "sensor.machine_state": "machineState",
  "sensor.oven_machine_state": "machineState",
  "sensor.washer_job_state": "jobState",
  "sensor.dryer_job_state": "jobState",
  "sensor.oven_job_state": "jobState",
  "sensor.progress": "jobState",
  "sensor.completion_time": "completion",
  "sensor.finish_time": "finishTime",
  "sensor.cook_finish_time": "finishTime",
  "sensor.completion_minutes": "completionMinutes",
  "sensor.cook_time_remaining": "cookTimeRemaining",
  "sensor.current_temp_c": "currentTemperature",
  "sensor.oven_mode": "currentMode",
  "sensor.oven_setpoint": "ovenSetpoint",
  "sensor.oven_state": "jobState",
  "sensor.cavity_state": "jobState",
  "binary_sensor.cycle_active": "cycleActive",
  "binary_sensor.door_open": "doorOpen",
  "binary_sensor.door": "doorOpen",
  "sensor.detergent_level": "detergent",
  "sensor.softener_level": "softener",
  "switch.auto_detergent": "autoDetergent",
  "switch.auto_softener": "autoSoftener",
  "select.operating_state": "operating",
  "button.start": "start",
  "button.pause": "pause",
  "button.stop": "stop",
  "button.start_cooking": "startCooking",
  "select.washer_cycle": "cycle",
  "select.dryer_cycle": "cycle",
  "select.oven_mode": "cycle",
  "select.cooking_mode": "cycle",
  "select.lamp": "lamp",
  "number.oven_setpoint": "ovenTemperature",
  "number.setpoint": "ovenTemperature",
  "number.cook_time": "cookTime",
  "select.water_temperature": "temperature",
  "select.wash_temperature": "temperature",
  "select.spin_level": "spin",
  "select.spin_speed": "spin",
  "select.dry_level": "dryLevel",
  "select.drying_time": "dryingTime",
  "select.detergent_amount": "detergentAmount",
  "select.detergent_quantity": "detergentAmount",
  "select.detergent_water_hardness": "detergentHardness",
  "select.softener_amount": "softenerAmount",
  "select.softener_quantity": "softenerAmount",
  "select.softener_concentration": "softenerConcentration",
  "number.washer_rinse_cycles": "rinse",
  "select.rinse_cycles": "rinse",
  "number.delay_end": "delayEnd",
  "number.delay_start_hours": "delayStart",
  "switch.bubble_soak": "bubbleSoak",
  "switch.pre_wash": "preWash",
  "switch.intensive": "intensive",
  "switch.wrinkle_prevent": "wrinklePrevent",
  "switch.auto_cycle_link": "autoCycleLink",
  "switch.lamp": "lamp",
  "switch.sound": "sound",
  "switch.fast_preheat": "fastPreheat",
  "switch.natural_steam": "naturalSteam",
  "switch.energy_saving": "energySaving",
  "light.lamp": "lamp",
  "binary_sensor.remote_control": "remote",
  "binary_sensor.child_lock": "childLock",
};

const PHASES = {
  washer: [
    { key: "wash", icon: "mdi:water", states: ["weight_sensing", "pre_wash", "wash", "ai_wash", "air_wash", "freeze_protection"] },
    { key: "rinse", icon: "mdi:water-sync", states: ["rinse", "ai_rinse"] },
    { key: "spin", icon: "mdi:rotate-right", states: ["spin", "ai_spin", "drying", "cooling", "wrinkle_prevent"] },
  ],
  dryer: [
    { key: "dry", icon: "mdi:heat-wave", states: ["weight_sensing", "drying", "ai_drying", "dehumidifying", "continuous_dehumidifying", "refreshing", "sanitizing", "internal_care"] },
    { key: "cool", icon: "mdi:snowflake", states: ["cooling"] },
    { key: "wrinkle", icon: "mdi:tshirt-crew-outline", states: ["wrinkle_prevent"] },
  ],
  drumClean: [
    { key: "drumClean", icon: "mdi:washing-machine", states: ["drumcleaning", "drum_cleaning"] },
  ],
};

const I18N = {
  it: {
    washer: "Lavatrice", dryer: "Asciugatrice", oven: "Forno",
    wash: "Lavaggio", rinse: "Risciacquo", spin: "Centrifuga", drumClean: "Pulizia cestello",
    dry: "Asciugatura", cool: "Raffreddamento", wrinkle: "Antipiega",
    running: "In funzione", paused: "In pausa", ready: "Pronta", finished: "Completato",
    delayed: "Partenza programmata", unavailable: "Non disponibile",
    start: "Avvia", resume: "Riprendi", pause: "Pausa", stop: "Stop",
    sendToOven: "Invia al forno",
    preheating: "Preriscaldamento",
    ends_at: "Termina alle", left: "rimanenti",
    remote_off: "Controllo remoto disattivato. Attivalo sull'apparecchio per comandarlo.",
    child_lock: "Blocco bambini attivo",
    program: "Programma", options: "Opzioni", supplies: "Detersivi",
    cookingMode: "Modalità di cottura", cookTime: "Durata cottura",
    startCooking: "Avvia cottura", currentTemperature: "Temperatura attuale", targetTemperature: "Temperatura impostata",
    readings: "Rilevazioni", door: "Porta", open: "Aperta", closed: "Chiusa",
    remaining: "Tempo rimanente",
    locked_running: "Non modificabile durante il ciclo",
    remote_start_unavailable: "Questa modalità può essere selezionata, ma non avviata da remoto.",
    localthings_mode_unavailable: "LocalThings non può inviare questa modalità al forno. Usa l'app SmartThings o il pannello del forno.",
    temperature: "Temperatura", spinLevel: "Centrifuga", rinseCount: "Risciacqui",
    dryLevel: "Grado asciugatura", dryingTime: "Durata",
    delayEnd: "Fine programmata", delayStart: "Partenza ritardata", off: "Off", in: "tra",
    bubbleSoak: "Bubble Soak", wrinklePrevent: "Antipiega", autoCycleLink: "Auto Cycle Link",
    preWash: "Prelavaggio", intensive: "Intensivo",
    detergent: "Detersivo", softener: "Ammorbidente",
    autoDetergent: "Dosaggio automatico detersivo", autoSoftener: "Dosaggio automatico ammorbidente",
    detergentAmount: "Dose detersivo", softenerAmount: "Dose ammorbidente",
    detergentHardness: "Durezza dell'acqua", softenerConcentration: "Concentrazione ammorbidente",
    on: "Attivo",
    lamp: "Luce del forno", sound: "Suono", fastPreheat: "Preriscaldamento rapido",
    naturalSteam: "Vapore naturale", energySaving: "Risparmio energetico",
    device: "Impostazioni dispositivo", close: "Chiudi",
  },
  en: {
    washer: "Washer", dryer: "Dryer", oven: "Oven",
    wash: "Wash", rinse: "Rinse", spin: "Spin", drumClean: "Drum cleaning",
    dry: "Drying", cool: "Cooling", wrinkle: "Wrinkle prevent",
    running: "Running", paused: "Paused", ready: "Ready", finished: "Finished",
    delayed: "Delayed start", unavailable: "Unavailable",
    start: "Start", resume: "Resume", pause: "Pause", stop: "Stop",
    sendToOven: "Send to oven",
    preheating: "Preheating",
    ends_at: "Ends at", left: "left",
    remote_off: "Remote control is off. Enable it on the appliance to control it.",
    child_lock: "Child lock on",
    program: "Program", options: "Options", supplies: "Supplies",
    cookingMode: "Cooking mode", cookTime: "Cook time",
    startCooking: "Start cooking", currentTemperature: "Current temperature", targetTemperature: "Set temperature",
    readings: "Readings", door: "Door", open: "Open", closed: "Closed",
    remaining: "Time remaining",
    locked_running: "Locked while a cycle runs",
    remote_start_unavailable: "This mode can be selected but cannot be started remotely.",
    localthings_mode_unavailable: "LocalThings cannot send this mode to the oven. Use the SmartThings app or the oven controls instead.",
    temperature: "Temperature", spinLevel: "Spin", rinseCount: "Rinses",
    dryLevel: "Dry level", dryingTime: "Drying time",
    delayEnd: "Delay end", delayStart: "Delay start", off: "Off", in: "in",
    bubbleSoak: "Bubble Soak", wrinklePrevent: "Wrinkle prevent", autoCycleLink: "Auto Cycle Link",
    preWash: "Prewash", intensive: "Intensive",
    detergent: "Detergent", softener: "Softener",
    autoDetergent: "Automatic detergent dosing", autoSoftener: "Automatic softener dosing",
    detergentAmount: "Detergent amount", softenerAmount: "Softener amount",
    detergentHardness: "Water hardness", softenerConcentration: "Softener concentration",
    on: "On",
    lamp: "Oven light", sound: "Sound", fastPreheat: "Fast preheat",
    naturalSteam: "Natural steam", energySaving: "Energy saving",
    device: "Device settings", close: "Close",
  },
  nl: {
    washer: "Wasmachine", dryer: "Droger", oven: "Oven",
    wash: "Wassen", rinse: "Spoelen", spin: "Centrifugeren", drumClean: "Trommelreiniging",
    dry: "Drogen", cool: "Afkoelen", wrinkle: "Kreukpreventie",
    running: "Bezig", paused: "Gepauzeerd", ready: "Gereed", finished: "Klaar",
    delayed: "Uitgestelde start", unavailable: "Niet beschikbaar",
    start: "Starten", resume: "Hervatten", pause: "Pauzeren", stop: "Stoppen",
    sendToOven: "Versturen naar oven",
    preheating: "Voorverwarmen",
    ends_at: "Klaar om", left: "resterend",
    remote_off: "Bediening op afstand is uitgeschakeld. Schakel deze in op het apparaat om het te bedienen.",
    child_lock: "Kinderslot is ingeschakeld",
    program: "Programma", options: "Opties", supplies: "Wasmiddelen",
    cookingMode: "Bereidingsmodus", cookTime: "Bereidingstijd",
    startCooking: "Bereiding starten", currentTemperature: "Huidige temperatuur", targetTemperature: "Ingestelde temperatuur",
    readings: "Metingen", door: "Deur", open: "Open", closed: "Gesloten",
    remaining: "Resterende tijd",
    locked_running: "Niet aanpasbaar tijdens een programma",
    remote_start_unavailable: "Deze modus kan worden geselecteerd, maar niet op afstand worden gestart.",
    localthings_mode_unavailable: "LocalThings kan deze modus niet naar de oven versturen. Gebruik de SmartThings-app of de bediening op de oven.",
    temperature: "Temperatuur", spinLevel: "Centrifugeren", rinseCount: "Spoelbeurten",
    dryLevel: "Droogtegraad", dryingTime: "Droogtijd",
    delayEnd: "Eindtijd uitstellen", delayStart: "Start uitstellen", off: "Uit", in: "over",
    bubbleSoak: "Bubble Soak", wrinklePrevent: "Kreukpreventie", autoCycleLink: "Auto Cycle Link",
    preWash: "Voorwas", intensive: "Intensief",
    detergent: "Wasmiddel", softener: "Wasverzachter",
    autoDetergent: "Automatische wasmiddeldosering", autoSoftener: "Automatische wasverzachterdosering",
    detergentAmount: "Hoeveelheid wasmiddel", softenerAmount: "Hoeveelheid wasverzachter",
    detergentHardness: "Waterhardheid", softenerConcentration: "Concentratie wasverzachter",
    on: "Aan",
    lamp: "Ovenlamp", sound: "Geluid", fastPreheat: "Snel voorverwarmen",
    naturalSteam: "Natuurlijke stoom", energySaving: "Energiebesparing",
    device: "Apparaatinstellingen", close: "Sluiten",
  },
};

const OPTION_TILES = {
  washer: [
    { role: "temperature", icon: "mdi:thermometer-water", label: "temperature" },
    { role: "spin", icon: "mdi:rotate-right", label: "spinLevel" },
    { role: "rinse", icon: "mdi:water-sync", label: "rinseCount" },
    { role: "delayEnd", icon: "mdi:timer-sand", label: "delayEnd" },
    { role: "delayStart", icon: "mdi:timer-plus-outline", label: "delayEnd" },
    { role: "bubbleSoak", icon: "mdi:chart-bubble", label: "bubbleSoak" },
    { role: "preWash", icon: "mdi:washing-machine", label: "preWash" },
    { role: "intensive", icon: "mdi:water-plus", label: "intensive" },
    { role: "autoDetergent", icon: "mdi:cup-water", label: "autoDetergent" },
    { role: "autoSoftener", icon: "mdi:flower", label: "autoSoftener" },
    { role: "detergentAmount", icon: "mdi:cup-water", label: "detergentAmount" },
    { role: "detergentHardness", icon: "mdi:water", label: "detergentHardness" },
    { role: "softenerAmount", icon: "mdi:flower", label: "softenerAmount" },
    { role: "softenerConcentration", icon: "mdi:flask-outline", label: "softenerConcentration" },
  ],
  dryer: [
    { role: "dryLevel", icon: "mdi:water-percent", label: "dryLevel" },
    { role: "dryingTime", icon: "mdi:timer-outline", label: "dryingTime" },
    { role: "delayEnd", icon: "mdi:timer-sand", label: "delayEnd" },
    { role: "wrinklePrevent", icon: "mdi:tshirt-crew-outline", label: "wrinklePrevent" },
    { role: "autoCycleLink", icon: "mdi:link-variant", label: "autoCycleLink" },
  ],
  oven: [
    { role: "ovenTemperature", icon: "mdi:thermometer-chevron-up", label: "temperature" },
    { role: "cookTime", icon: "mdi:timer-outline", label: "cookTime" },
    { role: "lamp", icon: "mdi:track-light", label: "lamp" },
    { role: "sound", icon: "mdi:volume-high", label: "sound" },
    { role: "fastPreheat", icon: "mdi:fire", label: "fastPreheat" },
    { role: "naturalSteam", icon: "mdi:kettle-steam", label: "naturalSteam" },
    { role: "energySaving", icon: "mdi:leaf", label: "energySaving" },
  ],
};

const ICON = { washer: "mdi:washing-machine", dryer: "mdi:tumble-dryer", oven: "mdi:stove" };
const DELAY_STEP = 60;

const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

function resolveDevice(hass, config) {
  if (config.device_id) return config.device_id;
  return hass.entities?.[config.entity]?.device_id;
}

function homeAssistantLanguage(hass = document.querySelector("home-assistant")?.hass) {
  const language = (hass?.locale?.language || hass?.language || document.documentElement.lang || "en").toLowerCase();
  return language.startsWith("it") ? "it" : language.startsWith("nl") ? "nl" : "en";
}

const CARD_NAMES = {
  it: "Elettrodomestici Samsung",
  nl: "Samsung-apparatenkaart",
  en: "Samsung appliance card",
};

const RESTRICTED_OVEN_MODELS = ["TP1X_DA-KS-OVEN-01061", "NQ5B4553FBS/U1"];
const REMOTE_STARTABLE_OVEN_MODES = new Set([
  "convection",
  "fanconventional",
  "largegrill",
  "fangrill",
  "airfryer",
  "deodorization",
  "keepwarm",
]);

function normalizeMode(option) {
  return String(option).toLowerCase().replace(/[^a-z0-9]/g, "");
}

function hasRemoteOvenModeRestrictions(device) {
  return [device?.model, device?.model_id].some((value) =>
    typeof value === "string" &&
    RESTRICTED_OVEN_MODELS.some((model) => value.toUpperCase().startsWith(model)),
  );
}

function canStartRemotely(a, option = a.ents.cycle?.state) {
  const mode = normalizeMode(option);
  const restrictedMode = a.kind === "oven" &&
    (a.restrictRemoteOvenModes || mode.startsWith("microwave"));
  return !restrictedMode ||
    REMOTE_STARTABLE_OVEN_MODES.has(mode);
}

function isChildLocked(entity) {
  if (!entity) return false;
  // Home Assistant lock-class binary sensors are on when unlocked.
  return entity.attributes?.device_class === "lock"
    ? entity.state === "off"
    : entity.state === "on";
}

// Snapshot of the appliance: role -> state object, plus derived status.
function readAppliance(hass, config) {
  const deviceId = resolveDevice(hass, config);
  const device = deviceId ? hass.devices?.[deviceId] : undefined;
  const ents = {};
  for (const entry of Object.values(hass.entities || {})) {
    if (entry.device_id !== deviceId || !["smartthings", "localthings"].includes(entry.platform)) continue;
    const domain = entry.entity_id.split(".")[0];
    const key = entry.translation_key || "";
    const localCycle = entry.platform === "localthings" && domain === "select" &&
      (key === "cycle" || /^(washer|dryer)_cycle(?:_table_[a-z0-9]+)?$/.test(key));
    const role = localCycle ? "cycle" : ROLES[`${domain}.${key}`];
    const stateObj = hass.states[entry.entity_id];
    if (role && stateObj && !ents[role]) ents[role] = stateObj;
  }
  const machineEntry = ents.machineState && hass.entities[ents.machineState.entity_id];
  const cycleEntry = ents.cycle && hass.entities[ents.cycle.entity_id];
  const translationKeys = [machineEntry?.translation_key, cycleEntry?.translation_key];
  const isOven = translationKeys.some((key) => ["oven_machine_state", "oven_mode", "cooking_mode"].includes(key)) ||
    Boolean(ents.currentMode || ents.ovenSetpoint || ents.ovenTemperature || ents.cookTime || ents.startCooking || ents.currentTemperature);
  const kind = isOven ? "oven" : translationKeys.some((key) => key?.includes("dryer")) ? "dryer" : "washer";
  if (isOven && !ents.currentTemperature) {
    const temperatureEntry = Object.values(hass.entities || {}).find((entry) =>
      entry.device_id === deviceId && entry.platform === "smartthings" &&
      entry.entity_id.startsWith("sensor.") && !entry.translation_key &&
      hass.states[entry.entity_id]?.attributes?.device_class === "temperature",
    );
    if (temperatureEntry) ents.currentTemperature = hass.states[temperatureEntry.entity_id];
  }
  const lang = homeAssistantLanguage(hass);
  const t = (k) => I18N[lang][k] ?? I18N.en[k] ?? k;

  const machine = ents.machineState?.state;
  const job = ents.jobState?.state;
  const available = machine !== undefined && machine !== "unavailable";
  const cycleActive = ents.cycleActive?.state;
  const running =
    ["run", "running"].includes(machine) ||
    (machine === "active" && (cycleActive === undefined || cycleActive === "on"));
  const paused = ["pause", "paused"].includes(machine);
  const active = cycleActive === "on" || running || paused;
  const delayed = ["delay_wash", "delaywash"].includes(job) || (kind === "oven" && job === "scheduled_start");
  const ovenState = typeof job === "string" ? job.toLowerCase() : "";
  const phases = kind === "oven" ? [] :
    kind === "washer" && PHASES.drumClean[0].states.includes(job) ? PHASES.drumClean : PHASES[kind];
  const phaseIndex = active ? phases.findIndex((p) => p.states.includes(job)) : -1;
  const finished = !active && (job === "finish" || job === "finished");

  let remainingMin = null;
  let endsAt = null;
  const remainingEntity = ents.completionMinutes || ents.cookTimeRemaining;
  const remainingValue = Number(remainingEntity?.state);
  if (active && Number.isFinite(remainingValue) && !["unknown", "unavailable"].includes(remainingEntity?.state)) {
    remainingMin = Math.max(0, Math.round(ents.completionMinutes ? remainingValue : remainingValue / 60));
  }
  const completion = (ents.finishTime || ents.completion)?.state;
  if (active && completion && !["unknown", "unavailable"].includes(completion)) {
    const date = new Date(completion);
    if (!Number.isNaN(date.getTime())) {
      endsAt = date;
      if (remainingMin == null) remainingMin = Math.max(0, Math.round((endsAt - Date.now()) / 60000));
    }
  }

  let status;
  if (!available) status = t("unavailable");
  else if (delayed) status = t("delayed");
  else if (paused) status = t("paused");
  else if (kind === "oven" && active && ["preheat", "preheating", "fast_preheat"].includes(ovenState)) status = t("preheating");
  else if (running) status = phaseIndex >= 0 ? t(phases[phaseIndex].key) : t("running");
  else if (finished) status = t("finished");
  else status = t("ready");

  return {
    deviceId, device, ents, kind, lang, t, machine, job, available, running, paused, active,
    delayed, phases, phaseIndex, finished, remainingMin, endsAt, status,
    cyclePlatform: cycleEntry?.platform,
    restrictRemoteOvenModes: kind === "oven" && hasRemoteOvenModeRestrictions(device),
    remoteOn: ents.remote ? ents.remote.state === "on" : true,
    name: device?.name_by_user || device?.name || t(kind),
  };
}

function operationService(a, option) {
  if (option === "send") {
    const cycle = a.ents.cycle;
    if (!cycle || ["unknown", "unavailable"].includes(cycle.state)) return null;
    return {
      domain: "select",
      service: "select_option",
      data: { entity_id: cycle.entity_id, option: cycle.state },
    };
  }
  if (option === "run" && a.kind === "oven" && !canStartRemotely(a)) return null;
  if (a.ents.operating) {
    return {
      domain: "select",
      service: "select_option",
      data: { entity_id: a.ents.operating.entity_id, option },
    };
  }
  let buttonRole = option;
  if (option === "run") {
    buttonRole = a.kind === "oven" && !a.paused ? "startCooking" : "start";
    if (a.kind === "oven" && !a.paused && !a.ents[buttonRole]) buttonRole = "start";
  }
  const button = a.ents[buttonRole];
  return button
    ? { domain: "button", service: "press", data: { entity_id: button.entity_id } }
    : null;
}

function formatDuration(min) {
  if (min == null) return "";
  const h = Math.floor(min / 60);
  const m = min % 60;
  return h ? `${h} h ${String(m).padStart(2, "0")} min` : `${m} min`;
}

function formatClock(hass, date) {
  return date.toLocaleTimeString(hass.locale?.language || undefined, { hour: "2-digit", minute: "2-digit" });
}

function optionLabel(hass, role, stateObj, option) {
  let label = hass.formatEntityState ? hass.formatEntityState(stateObj, option) : option;
  if (label === option && /^\d+$/.test(option)) {
    if (role === "temperature") label = `${option} °C`;
    else if (role === "spin") label = `${option} rpm`;
    else if (role === "dryingTime") label = option === "0" ? "Auto" : `${option} min`;
  }
  return label;
}

async function callService(hass, domain, service, data) {
  try {
    await hass.callService(domain, service, data);
    return null;
  } catch (err) {
    return err?.message || String(err);
  }
}

const SHARED_CSS = `
  :host { --accent: var(--primary-color); }
  ha-icon { --mdc-icon-size: 24px; display: inline-flex; }
  button { font: inherit; color: inherit; border: none; background: none; cursor: pointer; padding: 0; }
  button:disabled { cursor: default; }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes pulse { 50% { opacity: .45; } }
`;

class SamsungApplianceCard extends HTMLElement {
  static getConfigForm() {
    return {
      schema: [
        { name: "device_id", required: true, selector: { device: { filter: [{ integration: "smartthings" }, { integration: "localthings" }] } } },
        { name: "name", selector: { text: {} } },
      ],
    };
  }

  static getStubConfig(hass) {
    const entry = Object.values(hass.entities || {}).find(
      (e) => ["smartthings", "localthings"].includes(e.platform) &&
        ["washer_machine_state", "dryer_machine_state", "machine_state", "oven_machine_state"].includes(e.translation_key),
    );
    return { device_id: entry?.device_id || "" };
  }

  setConfig(config) {
    if (!config.device_id && !config.entity) throw new Error("Set device_id or entity");
    this._config = config;
    this._sig = null;
    if (this._hass) this._render();
  }

  set hass(hass) {
    this._hass = hass;
    this._dialog?.update(hass);
    this._render();
  }

  getCardSize() {
    return 1;
  }

  getGridOptions() {
    return { columns: 6, rows: 1, min_columns: 4, min_rows: 1 };
  }

  connectedCallback() {
    this._tick = setInterval(() => {
      this._sig = null;
      if (this._hass) this._render();
    }, 30000);
  }

  disconnectedCallback() {
    clearInterval(this._tick);
  }

  _render() {
    if (!this._config) return;
    const a = readAppliance(this._hass, this._config);
    const sig = JSON.stringify([
      a.name, a.status, a.remainingMin, a.phases.map((p) => p.key), a.phaseIndex, a.active, a.running, a.remoteOn, a.available, this._config.name, this._error,
    ]);
    if (sig === this._sig) return;
    this._sig = sig;
    if (!this.shadowRoot) {
      this.attachShadow({ mode: "open" });
      this.shadowRoot.addEventListener("click", (ev) => this._onClick(ev));
    }
    const name = this._config.name || a.name;
    const secondary = this._error || (a.active && a.remainingMin != null ? `${a.status} · ${formatDuration(a.remainingMin)}` : a.status);
    const canToggle = a.available && a.remoteOn && a.active &&
      Boolean(operationService(a, a.running ? "pause" : "run"));
    const segments = a.phases
      .map((_, i) => `<span class="seg ${i < a.phaseIndex ? "done" : i === a.phaseIndex ? "now" : ""}"></span>`)
      .join("");
    this.shadowRoot.innerHTML = `
      <style>
        ${SHARED_CSS}
        ha-card { height: 100%; box-sizing: border-box; cursor: pointer; overflow: hidden; }
        .row { display: flex; align-items: center; gap: 10px; padding: 10px; height: 100%; box-sizing: border-box; }
        .icon { position: relative; flex: none; width: 36px; height: 36px; border-radius: 50%; display: grid; place-items: center;
          color: var(--state-icon-color, var(--secondary-text-color));
          background: color-mix(in srgb, var(--secondary-text-color) 15%, transparent); }
        .icon.on { color: var(--accent); background: color-mix(in srgb, var(--accent) 20%, transparent); }
        .icon.on.running ha-icon { animation: pulse 2s ease-in-out infinite; }
        .info { flex: 1; min-width: 0; }
        .name { font-weight: 500; font-size: 14px; line-height: 20px; color: var(--primary-text-color); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .state { font-size: 12px; line-height: 16px; color: var(--secondary-text-color); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .bar { display: ${a.active ? "flex" : "none"}; gap: 3px; margin-top: 4px; }
        .seg { flex: 1; height: 3px; border-radius: 2px; background: color-mix(in srgb, var(--secondary-text-color) 25%, transparent); }
        .seg.done { background: var(--accent); }
        .seg.now { background: var(--accent); animation: pulse 1.6s ease-in-out infinite; }
        .action { flex: none; width: 36px; height: 36px; border-radius: 10px; display: grid; place-items: center;
          background: color-mix(in srgb, var(--accent) 20%, transparent); color: var(--accent); }
      </style>
      <ha-card>
        <div class="row">
          <div class="icon ${a.active ? "on" : ""} ${a.running ? "running" : ""}"><ha-icon icon="${ICON[a.kind]}"></ha-icon></div>
          <div class="info">
            <div class="name">${esc(name)}</div>
            <div class="state"${this._error ? ` title="${esc(this._error)}" role="status" aria-live="polite"` : ""}>${esc(secondary)}</div>
            <div class="bar">${segments}</div>
          </div>
          ${canToggle ? `<button class="action" data-action="toggle" title="${esc(a.running ? a.t("pause") : a.t("resume"))}"><ha-icon icon="${a.running ? "mdi:pause" : "mdi:play"}"></ha-icon></button>` : ""}
        </div>
      </ha-card>`;
  }

  _onClick(ev) {
    const action = ev.target.closest("[data-action]")?.dataset.action;
    if (action === "toggle") {
      ev.stopPropagation();
      const a = readAppliance(this._hass, this._config);
      const operation = operationService(a, a.running ? "pause" : "run");
      if (operation) this._call(operation.domain, operation.service, operation.data);
      return;
    }
    this._openDialog();
  }

  async _call(domain, service, data) {
    this._error = null;
    this._sig = null;
    this._render();
    this._error = await callService(this._hass, domain, service, data);
    this._sig = null;
    this._render();
  }

  _openDialog() {
    if (!this._dialog) {
      this._dialog = document.createElement("samsung-appliance-dialog");
      this._dialog.addEventListener("closed", () => {
        this._dialog.remove();
        this._dialog = null;
      });
    }
    this._dialog.config = this._config;
    document.body.appendChild(this._dialog);
    this._dialog.update(this._hass);
  }
}

class SamsungApplianceDialog extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._open = null;
    this._busy = null;
    this._error = null;
    this.shadowRoot.addEventListener("click", (ev) => this._onClick(ev));
    this._onKey = (ev) => ev.key === "Escape" && this.close();
    this._onPop = () => this._dismiss();
  }

  connectedCallback() {
    document.addEventListener("keydown", this._onKey);
    // A history entry lets the back gesture close the dialog, as HA more-info does.
    history.pushState({ ...history.state, samsungApplianceDialog: true }, "");
    window.addEventListener("popstate", this._onPop);
    this._tick = setInterval(() => this._render(true), 30000);
  }

  disconnectedCallback() {
    document.removeEventListener("keydown", this._onKey);
    window.removeEventListener("popstate", this._onPop);
    clearInterval(this._tick);
  }

  update(hass) {
    this._hass = hass;
    this._render();
  }

  close() {
    if (history.state?.samsungApplianceDialog) history.back();
    else this._dismiss();
  }

  _dismiss() {
    this.dispatchEvent(new CustomEvent("closed"));
  }

  _render(force = false) {
    if (!this._hass || !this.config) return;
    const a = readAppliance(this._hass, this.config);
    const sig = JSON.stringify([
      Object.values(a.ents).map((s) => [s.entity_id, s.state, s.attributes.options]),
      this._open, this._busy, this._error, a.remainingMin,
    ]);
    if (!force && sig === this._sig) return;
    this._sig = sig;
    // The shell is built once: recreating it would replay the open animation.
    if (!this._shell) {
      this.shadowRoot.innerHTML = `<style>${SHARED_CSS}${DIALOG_CSS}</style>
        <div class="scrim" data-action="close"></div>
        <div class="dialog" role="dialog" aria-modal="true"></div>`;
      this._shell = this.shadowRoot.querySelector(".dialog");
    }
    const name = this.config.name || a.name;
    this._shell.setAttribute("aria-label", name);
    const scroll = this.shadowRoot.querySelector(".content")?.scrollTop ?? 0;
    this._shell.innerHTML = this._template(a, name);
    this.shadowRoot.querySelector(".content").scrollTop = scroll;
  }

  _template(a, name) {
    const { t } = a;
    const locked = a.active || !a.available;
    const ctlDisabled = !a.available || !a.remoteOn;
    return `
        <div class="header">
          <button class="icon-btn" data-action="close" title="${esc(t("close"))}"><ha-icon icon="mdi:close"></ha-icon></button>
          <div class="title">
            <div class="name">${esc(name)}</div>
            ${name !== t(a.kind) ? `<div class="sub">${esc(t(a.kind))}</div>` : ""}
          </div>
          ${a.deviceId ? `<button class="icon-btn" data-action="device" title="${esc(t("device"))}"><ha-icon icon="mdi:cog-outline"></ha-icon></button>` : ""}
        </div>
        <div class="content">
          ${this._hero(a)}
          ${a.active && a.phases.length ? this._stepper(a) : ""}
          <div class="controls">
            ${this._controlButtons(a, ctlDisabled)}
          </div>
          ${a.available && !a.remoteOn ? `<div class="banner"><ha-icon icon="mdi:remote-off"></ha-icon><span>${esc(t("remote_off"))}</span></div>` : ""}
          ${isChildLocked(a.ents.childLock) ? `<div class="banner soft"><ha-icon icon="mdi:lock"></ha-icon><span>${esc(t("child_lock"))}</span></div>` : ""}
          ${this._error ? `<div class="banner"><ha-icon icon="mdi:alert-circle-outline"></ha-icon><span>${esc(this._error)}</span></div>` : ""}
          ${a.ents.cycle || a.ents.currentMode ? this._programSection(a, locked || !a.remoteOn) : ""}
          ${this._optionsSection(a, locked)}
          ${this._ovenReadingsSection(a)}
          ${this._suppliesSection(a)}
        </div>`;
  }

  _hero(a) {
    const { t } = a;
    const r = 88;
    const circ = 2 * Math.PI * r;
    const n = a.phases.length;
    const gap = 10;
    const segLen = n ? circ / n - gap : 0;
    const arcs = a.phases
      .map((_, i) => {
        const cls = !a.active ? "" : i < a.phaseIndex ? "done" : i === a.phaseIndex ? "now" : "";
        return `<circle class="arc ${cls}" r="${r}" cx="100" cy="100" stroke-dasharray="${segLen} ${circ - segLen}" stroke-dashoffset="${-(i * (circ / n)) - gap / 2}"></circle>`;
      })
      .join("");
    let big;
    let small;
    if (a.active && a.remainingMin != null) {
      big = formatDuration(a.remainingMin);
      small = a.endsAt ? `${t("ends_at")} ${formatClock(this._hass, a.endsAt)}` : t("left");
    } else {
      big = a.status;
      const mode = a.ents.cycle || a.ents.currentMode;
      small = mode && a.available ? optionLabel(this._hass, "cycle", mode, mode.state) : "";
    }
    return `
      <div class="hero ${a.active ? "active" : ""} ${a.running ? "running" : ""}">
        <svg viewBox="0 0 200 200" aria-hidden="true"><g transform="rotate(-90 100 100)">${arcs}</g></svg>
        <div class="hero-inner">
          <div class="drum"><ha-icon icon="${ICON[a.kind]}"></ha-icon></div>
          <div class="big">${esc(big)}</div>
          <div class="small">${esc(a.active ? a.status : small)}</div>
          ${a.active && small ? `<div class="small muted">${esc(small)}</div>` : ""}
        </div>
      </div>`;
  }

  _stepper(a) {
    return `<div class="stepper">${a.phases
      .map((p, i) => {
        const cls = i < a.phaseIndex ? "done" : i === a.phaseIndex ? "now" : "";
        return `<div class="step ${cls}"><ha-icon icon="${i < a.phaseIndex ? "mdi:check" : p.icon}"></ha-icon><span>${esc(a.t(p.key))}</span></div>`;
      })
      .join('<div class="step-line"></div>')}</div>`;
  }

  _controlButtons(a, disabled) {
    const { t } = a;
    const busy = (k) => (this._busy === k ? " busy" : "");
    const sendMode = a.kind === "oven" && !a.active && !canStartRemotely(a);
    const main = a.running
      ? { opt: "pause", icon: "mdi:pause", label: t("pause") }
      : sendMode
        ? { opt: "send", icon: "mdi:send", label: t("sendToOven") }
        : { opt: "run", icon: "mdi:play", label: a.paused ? t("resume") : a.kind === "oven" ? t("startCooking") : t("start") };
    const mainOperation = operationService(a, main.opt);
    const mainDisabled = disabled || (main.opt === "run" && !canStartRemotely(a));
    const stopDisabled = disabled || !a.active || !operationService(a, "stop");
    return `
      ${a.kind === "oven" && !mainOperation ? "" : `
        <button class="ctl primary${busy(main.opt)}" data-action="operate" data-option="${main.opt}" ${mainDisabled ? "disabled" : ""}>
          <ha-icon icon="${main.icon}"></ha-icon><span>${esc(main.label)}</span>
        </button>`}
      <button class="ctl${busy("stop")}" data-action="operate" data-option="stop" ${stopDisabled ? "disabled" : ""}>
        <ha-icon icon="mdi:stop"></ha-icon><span>${esc(t("stop"))}</span>
      </button>`;
  }

  _programSection(a, locked) {
    const s = a.ents.cycle || a.ents.currentMode;
    if (!a.ents.cycle) {
      return `
        <div class="section">
          <div class="section-title">${esc(a.t("cookingMode"))}</div>
          <div class="select-row"><ha-icon icon="mdi:tune-variant"></ha-icon><span class="grow">${esc(optionLabel(this._hass, "cycle", s, s.state))}</span></div>
        </div>`;
    }
    const options = s.attributes.options || [];
    const open = this._open === "cycle" && !locked;
    const modeCannotStart = !a.active && !canStartRemotely(a);
    const hint = locked && a.active
      ? a.t("locked_running")
      : modeCannotStart
        ? a.t(a.cyclePlatform === "localthings" ? "localthings_mode_unavailable" : "remote_start_unavailable")
        : null;
    return `
      <div class="section">
        <div class="section-title">${esc(a.t(a.kind === "oven" ? "cookingMode" : "program"))}${hint ? `<span class="hint">${esc(hint)}</span>` : ""}</div>
        <button class="select-row ${open ? "open" : ""}" data-action="expand" data-role="cycle" ${locked ? "disabled" : ""}>
          <ha-icon icon="mdi:tune-variant"></ha-icon>
          <span class="grow">${esc(optionLabel(this._hass, "cycle", s, s.state))}</span>
          <ha-icon class="chev" icon="mdi:chevron-down"></ha-icon>
        </button>
        ${open ? this._pills(a, "cycle", s, options, true) : ""}
      </div>`;
  }

  _pills(a, role, s, options, wide = false) {
    return `<div class="pills ${wide ? "wide" : ""}">${options
      .map(
        (o) => `<button class="pill ${o === s.state ? "sel" : ""}${this._busy === `${role}:${o}` ? " busy" : ""}" data-action="select" data-role="${role}" data-option="${esc(o)}">${esc(optionLabel(this._hass, role, s, o))}</button>`,
      )
      .join("")}</div>`;
  }

  _optionsSection(a, locked) {
    const tiles = OPTION_TILES[a.kind].filter((tile) => a.ents[tile.role]);
    if (!tiles.length) return "";
    let panel = "";
    const html = tiles
      .map((tile) => {
        const s = a.ents[tile.role];
        const domain = s.entity_id.split(".")[0];
        const unavailable = s.state === "unavailable";
        // Oven setpoint/time and non-heating settings can change mid-cycle.
        const changeDuringCycle = ["detergentAmount", "detergentHardness", "softenerAmount", "softenerConcentration", "ovenTemperature", "cookTime", "lamp", "sound", "energySaving"];
        const disabled = unavailable || (locked && !changeDuringCycle.includes(tile.role)) ||
          (domain === "switch" && s.state !== "on" && s.attributes.course_supported === false);
        const toggleable = domain === "switch" || domain === "light";
        const isOn = toggleable && s.state === "on";
        let value;
        if (toggleable) value = isOn ? a.t("on") : a.t("off");
        else if (tile.role === "delayEnd") value = Number(s.state) > 0 ? formatDuration(Number(s.state)) : a.t("off");
        else if (tile.role === "delayStart") value = Number(s.state) > 0 ? formatDuration(Number(s.state) * 60) : a.t("off");
        else if (domain === "number") value = [s.state, s.attributes.unit_of_measurement].filter(Boolean).join(" ");
        else value = unavailable ? "-" : optionLabel(this._hass, tile.role, s, s.state);
        const open = this._open === tile.role && !disabled;
        if (open) panel = this._optionPanel(a, tile, s);
        const action = toggleable ? "toggle-switch" : "expand";
        return `
          <button class="tile ${isOn ? "on" : ""} ${open ? "open" : ""}${this._busy === tile.role ? " busy" : ""}" data-action="${action}" data-role="${tile.role}" ${disabled ? "disabled" : ""}>
            <ha-icon icon="${tile.icon}"></ha-icon>
            <span class="tile-text"><span class="tile-label">${esc(a.t(tile.label))}</span><span class="tile-value">${esc(value)}</span></span>
          </button>`;
      })
      .join("");
    return `
      <div class="section">
        <div class="section-title">${esc(a.t("options"))}</div>
        <div class="tiles">${html}</div>
        ${panel}
      </div>`;
  }

  _optionPanel(a, tile, s) {
    const domain = s.entity_id.split(".")[0];
    if (domain === "select") return this._pills(a, tile.role, s, s.attributes.options || []);
    const min = Number(s.attributes.min ?? 0);
    const max = Number(s.attributes.max ?? 100);
    const step = tile.role === "delayEnd" ? DELAY_STEP : Number(s.attributes.step ?? 1);
    const value = Number(s.state) || 0;
    const shown =
      tile.role === "delayEnd"
        ? value > 0
          ? `${a.t("in")} ${formatDuration(value)}`
          : a.t("off")
        : tile.role === "delayStart"
          ? value > 0
            ? `${a.t("in")} ${formatDuration(value * 60)}`
            : a.t("off")
        : tile.role === "cookTime"
          ? formatDuration(value)
        : tile.role === "ovenTemperature"
          ? [value, s.attributes.unit_of_measurement].filter(Boolean).join(" ")
        : String(value);
    return `
      <div class="stepper-ctl">
        <button class="round" data-action="number" data-role="${tile.role}" data-value="${Math.max(min, value - step)}" ${value <= min ? "disabled" : ""}><ha-icon icon="mdi:minus"></ha-icon></button>
        <div class="num">${esc(shown)}</div>
        <button class="round" data-action="number" data-role="${tile.role}" data-value="${Math.min(max, value + step)}" ${value >= max ? "disabled" : ""}><ha-icon icon="mdi:plus"></ha-icon></button>
      </div>`;
  }

  _suppliesSection(a) {
    const items = [
      ["detergent", "mdi:cup-water"],
      ["softener", "mdi:flower"],
    ].filter(([role]) => a.ents[role] && !["unknown", "unavailable"].includes(a.ents[role].state));
    if (!items.length) return "";
    return `
      <div class="section">
        <div class="section-title">${esc(a.t("supplies"))}</div>
        <div class="chips">${items
          .map(([role, icon]) => {
            const s = a.ents[role];
            const warn = ["empty", "less"].includes(s.state);
            const label = this._hass.formatEntityState ? this._hass.formatEntityState(s) : s.state;
            return `<div class="chip ${warn ? "warn" : ""}"><ha-icon icon="${warn ? "mdi:alert" : icon}"></ha-icon>${esc(a.t(role))}: ${esc(label)}</div>`;
          })
          .join("")}</div>
      </div>`;
  }

  _ovenReadingsSection(a) {
    if (a.kind !== "oven") return "";
    const items = [];
    const temperature = a.ents.currentTemperature;
    if (temperature && !["unknown", "unavailable"].includes(temperature.state)) {
      const value = [temperature.state, temperature.attributes.unit_of_measurement].filter(Boolean).join(" ");
      items.push(`<div class="chip"><ha-icon icon="mdi:thermometer"></ha-icon>${esc(a.t("currentTemperature"))}: ${esc(value)}</div>`);
    }
    const setpoint = a.ents.ovenSetpoint;
    if (setpoint && !["unknown", "unavailable"].includes(setpoint.state)) {
      const value = [setpoint.state, setpoint.attributes.unit_of_measurement].filter(Boolean).join(" ");
      items.push(`<div class="chip"><ha-icon icon="mdi:thermometer-chevron-up"></ha-icon>${esc(a.t("targetTemperature"))}: ${esc(value)}</div>`);
    }
    const remaining = a.ents.cookTimeRemaining;
    if (remaining && !["unknown", "unavailable"].includes(remaining.state)) {
      const minutes = Math.max(0, Math.round(Number(remaining.state) / 60));
      if (Number.isFinite(minutes)) {
        items.push(`<div class="chip"><ha-icon icon="mdi:timer-sand"></ha-icon>${esc(a.t("remaining"))}: ${esc(formatDuration(minutes))}</div>`);
      }
    }
    const door = a.ents.doorOpen;
    if (door && !["unknown", "unavailable"].includes(door.state)) {
      const open = door.state === "on";
      items.push(`<div class="chip"><ha-icon icon="${open ? "mdi:door-open" : "mdi:door-closed"}"></ha-icon>${esc(a.t("door"))}: ${esc(a.t(open ? "open" : "closed"))}</div>`);
    }
    if (!items.length) return "";
    return `<div class="section"><div class="section-title">${esc(a.t("readings"))}</div><div class="chips">${items.join("")}</div></div>`;
  }

  async _call(busyKey, domain, service, data) {
    this._busy = busyKey;
    this._error = null;
    this._render();
    this._error = await callService(this._hass, domain, service, data);
    this._busy = null;
    this._render(true);
  }

  _onClick(ev) {
    const el = ev.target.closest("[data-action]");
    if (!el || el.disabled) return;
    const a = readAppliance(this._hass, this.config);
    const { action, role, option, value } = el.dataset;
    switch (action) {
      case "close":
        this.close();
        break;
      case "device":
        history.replaceState(null, "", `/config/devices/device/${a.deviceId}`);
        this._dismiss();
        window.dispatchEvent(new CustomEvent("location-changed"));
        break;
      case "operate":
        if (option === "send" && a.cyclePlatform === "localthings" && !canStartRemotely(a)) {
          this._error = a.t("localthings_mode_unavailable");
          this._render(true);
          break;
        }
        const operation = operationService(a, option);
        if (operation) this._call(option, operation.domain, operation.service, operation.data);
        break;
      case "expand":
        this._open = this._open === role ? null : role;
        this._render(true);
        break;
      case "select":
        if (role === "cycle" && !a.active && a.cyclePlatform === "localthings" && !canStartRemotely(a, option)) {
          this._error = a.t("localthings_mode_unavailable");
          this._render(true);
          break;
        }
        this._open = role === "cycle" ? null : this._open;
        this._call(`${role}:${option}`, "select", "select_option", { entity_id: a.ents[role].entity_id, option });
        break;
      case "number":
        this._call(role, "number", "set_value", { entity_id: a.ents[role].entity_id, value: Number(value) });
        break;
      case "toggle-switch":
        this._call(role, a.ents[role].entity_id.split(".")[0], "toggle", { entity_id: a.ents[role].entity_id });
        break;
    }
  }
}

const DIALOG_CSS = `
  :host { position: fixed; inset: 0; z-index: 7; display: flex; align-items: center; justify-content: center;
    font-family: var(--ha-font-family-body, Roboto, sans-serif); color: var(--primary-text-color); }
  .scrim { position: absolute; inset: 0; background: rgba(0, 0, 0, .45); animation: fade .15s ease-out; }
  @keyframes fade { from { opacity: 0; } }
  @keyframes rise { from { transform: translateY(24px); opacity: 0; } }
  .dialog { position: relative; width: min(460px, 100vw); max-height: min(90vh, 860px); display: flex; flex-direction: column;
    background: var(--ha-dialog-surface-background, var(--card-background-color, #fff)); border-radius: var(--ha-dialog-border-radius, 28px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, .3); overflow: hidden; animation: rise .2s ease-out; }
  @media (max-width: 600px) {
    :host { align-items: flex-end; }
    .dialog { width: 100vw; max-height: 94vh; border-radius: 28px 28px 0 0; }
  }
  .header { display: flex; align-items: center; gap: 4px; padding: 12px 12px 4px; }
  .title { flex: 1; min-width: 0; padding: 0 4px; }
  .title .name { font-size: 20px; line-height: 26px; font-weight: 400; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .title .sub { font-size: 13px; color: var(--secondary-text-color); }
  .icon-btn { width: 48px; height: 48px; border-radius: 50%; display: grid; place-items: center; color: var(--primary-text-color); }
  .icon-btn:hover { background: color-mix(in srgb, var(--primary-text-color) 8%, transparent); }
  .content { overflow-y: auto; padding: 0 24px 24px; }

  .hero { position: relative; width: 240px; max-width: 70vw; aspect-ratio: 1; margin: 8px auto 12px; }
  .hero svg { width: 100%; height: 100%; }
  .arc { fill: none; stroke-width: 12; stroke-linecap: round; stroke: color-mix(in srgb, var(--secondary-text-color) 18%, transparent); transition: stroke .3s; }
  .arc.done { stroke: var(--accent); }
  .arc.now { stroke: var(--accent); animation: pulse 1.6s ease-in-out infinite; }
  .hero-inner { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 0 36px; }
  .drum { width: 56px; height: 56px; border-radius: 50%; display: grid; place-items: center; margin-bottom: 6px;
    color: var(--secondary-text-color); background: color-mix(in srgb, var(--secondary-text-color) 12%, transparent); }
  .drum ha-icon { --mdc-icon-size: 32px; }
  .hero.active .drum { color: var(--accent); background: color-mix(in srgb, var(--accent) 18%, transparent); }
  .hero.running .drum ha-icon { animation: pulse 2s ease-in-out infinite; }
  .big { font-size: 28px; line-height: 34px; font-weight: 500; }
  .small { font-size: 14px; color: var(--primary-text-color); margin-top: 2px; }
  .small.muted { color: var(--secondary-text-color); font-size: 13px; }

  .stepper { display: flex; align-items: center; justify-content: center; margin: 0 0 16px; }
  .step { display: flex; flex-direction: column; align-items: center; gap: 4px; font-size: 12px; color: var(--secondary-text-color); min-width: 72px; }
  .step ha-icon { width: 32px; height: 32px; border-radius: 50%; display: grid; place-items: center; --mdc-icon-size: 18px;
    background: color-mix(in srgb, var(--secondary-text-color) 12%, transparent); }
  .step.done, .step.now { color: var(--primary-text-color); }
  .step.done ha-icon { background: var(--accent); color: var(--text-primary-color, #fff); }
  .step.now ha-icon { background: color-mix(in srgb, var(--accent) 25%, transparent); color: var(--accent); outline: 2px solid var(--accent); }
  .step-line { flex: 1; max-width: 40px; height: 2px; margin-bottom: 20px; background: color-mix(in srgb, var(--secondary-text-color) 25%, transparent); }

  .controls { display: flex; gap: 12px; justify-content: center; margin-bottom: 16px; }
  .ctl { flex: 1; max-width: 180px; height: 56px; border-radius: 16px; display: flex; align-items: center; justify-content: center; gap: 8px;
    font-size: 15px; font-weight: 500; background: color-mix(in srgb, var(--primary-text-color) 8%, transparent); transition: background .15s, opacity .15s; }
  .ctl.primary { background: var(--accent); color: var(--text-primary-color, #fff); }
  .ctl:not(:disabled):hover { filter: brightness(1.08); }
  .ctl:disabled { opacity: .38; }

  .busy { pointer-events: none; animation: pulse 1s ease-in-out infinite; }
  .banner { display: flex; gap: 10px; align-items: flex-start; padding: 12px 14px; margin-bottom: 12px; border-radius: 12px; font-size: 13px; line-height: 18px;
    background: color-mix(in srgb, var(--warning-color, #ffa600) 16%, transparent); }
  .banner ha-icon { color: var(--warning-color, #ffa600); flex: none; --mdc-icon-size: 20px; }
  .banner.soft { background: color-mix(in srgb, var(--secondary-text-color) 10%, transparent); }
  .banner.soft ha-icon { color: var(--secondary-text-color); }

  .section { margin-top: 16px; }
  .section-title { font-size: 14px; font-weight: 500; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: baseline; gap: 8px; }
  .hint { font-size: 12px; font-weight: 400; color: var(--secondary-text-color); }
  .select-row { width: 100%; display: flex; align-items: center; gap: 12px; padding: 0 16px; height: 56px; border-radius: 16px; text-align: left;
    background: color-mix(in srgb, var(--primary-text-color) 6%, transparent); }
  .select-row ha-icon:first-child { color: var(--accent); }
  .select-row .grow { flex: 1; font-size: 15px; }
  .select-row .chev { transition: transform .2s; color: var(--secondary-text-color); }
  .select-row.open .chev { transform: rotate(180deg); }
  .select-row:disabled { opacity: .5; }

  .pills { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
  .pills.wide { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); }
  .pill { padding: 8px 14px; min-height: 36px; border-radius: 18px; font-size: 13px; text-align: center;
    border: 1px solid var(--divider-color, rgba(0,0,0,.12)); }
  .pill:hover { background: color-mix(in srgb, var(--primary-text-color) 6%, transparent); }
  .pill:disabled { opacity: .48; cursor: not-allowed; }
  .pill:disabled:hover { background: none; }
  .pill.sel { background: color-mix(in srgb, var(--accent) 20%, transparent); border-color: var(--accent); color: var(--primary-text-color); font-weight: 500; }

  .tiles { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .tile { display: flex; align-items: center; gap: 10px; padding: 10px 12px; min-height: 56px; border-radius: 16px; text-align: left;
    background: color-mix(in srgb, var(--primary-text-color) 6%, transparent); transition: background .15s; }
  .tile ha-icon { flex: none; color: var(--secondary-text-color); }
  .tile.on ha-icon, .tile.open ha-icon { color: var(--accent); }
  .tile.on { background: color-mix(in srgb, var(--accent) 16%, transparent); }
  .tile.open { outline: 2px solid var(--accent); }
  .tile:disabled { opacity: .45; }
  .tile-text { display: flex; flex-direction: column; min-width: 0; }
  .tile-label { font-size: 12px; color: var(--secondary-text-color); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .tile-value { font-size: 14px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

  .stepper-ctl { display: flex; align-items: center; justify-content: center; gap: 24px; margin-top: 12px; }
  .round { width: 48px; height: 48px; border-radius: 50%; display: grid; place-items: center;
    background: color-mix(in srgb, var(--primary-text-color) 8%, transparent); }
  .round:disabled { opacity: .38; }
  .num { min-width: 110px; text-align: center; font-size: 18px; font-weight: 500; }

  .chips { display: flex; flex-wrap: wrap; gap: 8px; }
  .chip { display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 16px; font-size: 13px;
    background: color-mix(in srgb, var(--primary-text-color) 6%, transparent); }
  .chip ha-icon { --mdc-icon-size: 18px; color: var(--secondary-text-color); }
  .chip.warn ha-icon { color: var(--warning-color, #ffa600); }
`;

customElements.define("samsung-appliance-card", SamsungApplianceCard);
customElements.define("samsung-appliance-dialog", SamsungApplianceDialog);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "samsung-appliance-card",
  get name() {
    return CARD_NAMES[homeAssistantLanguage()];
  },
  description: "Samsung washer, dryer, and oven with a more-info style control dialog.",
  preview: false,
});

console.info(`%c SAMSUNG-APPLIANCE-CARD %c ${VERSION} `, "background:#03a9f4;color:#fff", "");
