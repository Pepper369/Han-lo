import { AppState, Settings } from "../types";
import { dayKey, prevDayKey } from "./core";
import { SoundFX } from "./audioFx";

const KEY = "hanlo.v1";

export function getDefaultState(): AppState {
  return {
    v: 1,
    cards: {},
    settings: {
      pinyin: true,
      audio: true,
      sfx: true,
      goal: 10,
      onboarded: false,
      goalType: "thi",
      level: "1"
    },
    streak: { count: 0, last: "" },
    history: {},
    daily: { date: "", new: 0 },
    examHistory: []
  };
}

export function loadState(): AppState {
  const d = getDefaultState();
  if (typeof window === "undefined") return d;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return d;
    const s = JSON.parse(raw);
    const loaded: AppState = {
      v: s.v || d.v,
      cards: s.cards || {},
      settings: { ...d.settings, ...(s.settings || {}) },
      streak: { ...d.streak, ...(s.streak || {}) },
      history: s.history || {},
      daily: { ...d.daily, ...(s.daily || {}) },
      examHistory: s.examHistory || []
    };
    SoundFX.enabled = loaded.settings.sfx !== false;
    return loaded;
  } catch (e) {
    return d;
  }
}

export function saveState(state: AppState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
    SoundFX.enabled = state.settings.sfx !== false;
  } catch (e) {}
}

export function todayFresh(state: AppState): AppState {
  const t = dayKey();
  if (state.daily.date !== t) {
    return {
      ...state,
      daily: { date: t, new: 0 }
    };
  }
  return state;
}

export function recordAnswerInState(state: AppState, correct: boolean): AppState {
  const key = dayKey();
  let count = state.streak.count;
  if (state.streak.last !== key) {
    count = state.streak.last === prevDayKey() ? count + 1 : 1;
  }

  const prevRec = state.history[key] || { n: 0, c: 0 };
  const updatedRec = {
    n: prevRec.n + 1,
    c: prevRec.c + (correct ? 1 : 0)
  };

  const nextState: AppState = {
    ...state,
    streak: {
      count,
      last: key
    },
    history: {
      ...state.history,
      [key]: updatedRec
    }
  };

  saveState(nextState);
  return nextState;
}

export function exportBackup(state: AppState): void {
  SoundFX.tap();
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
  const dl = document.createElement("a");
  dl.setAttribute("href", dataStr);
  dl.setAttribute("download", `hanlo_backup_${dayKey()}.json`);
  document.body.appendChild(dl);
  dl.click();
  dl.remove();
}

export function importBackupFromFile(
  file: File,
  onSuccess: (state: AppState) => void,
  onError: (msg: string) => void
): void {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const content = e.target?.result as string;
      const imported = JSON.parse(content);
      if (imported && imported.v && imported.cards) {
        saveState(imported);
        SoundFX.zenBell();
        onSuccess(imported);
      } else {
        onError("File sao lưu không hợp lệ.");
      }
    } catch (err) {
      onError("Lỗi đọc file sao lưu.");
    }
  };
  reader.readAsText(file);
}
