import { STAGES } from "../data/stages.js";

const baseStages = STAGES.map((stage) => ({
  id: stage.id,
  turns: stage.turns,
  goalLabel: stage.goal.label,
  goalTarget: stage.goal.target,
}));

const defaultConfig = {
  projectName: "Goblin Match Demo",
  orientation: "portrait",
  stageId: "normal",
  leaderId: "blue",
  autoStart: false,
  turnLimit: null,
  goalLabel: "Clear relic items",
  tutorial: {
    enabled: true,
    stepCount: 3,
    copy: "Drag the leader one tile to trigger a match and clear relic crates.",
    mode: "Auto-run",
  },
  endCard: {
    ctaText: "Play Now",
    note: "Clear every relic crate before turns run out.",
  },
  theme: {
    primaryAccent: "#5E8CFF",
    backgroundTone: "Parchment",
  },
  exportPreset: "Meta",
};

let runtimeConfig = { ...defaultConfig };
let bridgeHandlers = null;

function isObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function deepMerge(base, patch) {
  const result = { ...base };
  Object.entries(patch ?? {}).forEach(([key, value]) => {
    if (isObject(value) && isObject(base[key])) {
      result[key] = deepMerge(base[key], value);
    } else {
      result[key] = value;
    }
  });
  return result;
}

function parseBoolean(value) {
  return value === "1" || value === "true";
}

function getQueryConfig() {
  const params = new URLSearchParams(window.location.search);
  return {
    orientation: params.get("orientation") ?? undefined,
    stageId: params.get("stage") ?? undefined,
    leaderId: params.get("leader") ?? undefined,
    autoStart: params.has("autostart") ? parseBoolean(params.get("autostart")) : undefined,
  };
}

function applyStageOverrides() {
  STAGES.forEach((stage) => {
    const original = baseStages.find((item) => item.id === stage.id);
    if (!original) {
      return;
    }

    stage.turns = runtimeConfig.turnLimit ?? original.turns;
    stage.goal.label = runtimeConfig.goalLabel || original.goalLabel;
    stage.goal.target = original.goalTarget;
  });
}

function applyDocumentTheme() {
  document.documentElement.dataset.orientation = runtimeConfig.orientation;
  document.documentElement.style.setProperty("--weplable-accent", runtimeConfig.theme.primaryAccent);
}

function postToParent(type, payload) {
  if (window.parent && window.parent !== window) {
    window.parent.postMessage({ type, payload }, "*");
  }
}

export function getRuntimeConfig() {
  return runtimeConfig;
}

export function applyRuntimeConfig(nextConfig) {
  runtimeConfig = deepMerge(runtimeConfig, nextConfig);
  applyStageOverrides();
  applyDocumentTheme();
  return runtimeConfig;
}

export function notifyState(payload) {
  postToParent("goblinmatch:state", payload);
}

export function notifyReady(payload) {
  postToParent("goblinmatch:ready", payload);
}

export function registerWeplableBridge(handlers) {
  bridgeHandlers = handlers;
  applyRuntimeConfig(getQueryConfig());
  notifyReady({ config: runtimeConfig });

  window.addEventListener("message", (event) => {
    const message = event.data;
    if (!message || typeof message !== "object") {
      return;
    }

    if (message.type === "weplable:init") {
      applyRuntimeConfig(message.payload?.config ?? {});
      bridgeHandlers?.onConfig?.(runtimeConfig);
      notifyReady({ config: runtimeConfig });
      return;
    }

    if (message.type !== "weplable:command") {
      return;
    }

    switch (message.command) {
      case "restart":
        bridgeHandlers?.onRestart?.();
        break;
      case "showTutorial":
        bridgeHandlers?.onShowTutorial?.();
        break;
      case "hideTutorial":
        bridgeHandlers?.onHideTutorial?.();
        break;
      case "showEndCard":
        bridgeHandlers?.onShowEndCard?.();
        break;
      case "setOrientation":
        applyRuntimeConfig({ orientation: message.payload?.orientation ?? "portrait" });
        bridgeHandlers?.onConfig?.(runtimeConfig);
        break;
      default:
        break;
    }
  });
}
