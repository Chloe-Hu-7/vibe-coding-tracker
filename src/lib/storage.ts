import { TaskProgress, Note, QARecord, AppState, tasks } from './types';

const STORAGE_KEY = 'vibe-coding-tracker';

export function getInitialState(): AppState {
  return {
    tasks: tasks.map(t => ({ day: t.day, completed: false })),
    notes: [],
    qaRecords: [],
    apiKey: '',
    streakDays: 0,
    lastActiveDate: '',
  };
}

export function loadState(): AppState {
  if (typeof window === 'undefined') return getInitialState();

  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return getInitialState();

  try {
    const parsed = JSON.parse(saved);
    // Merge with initial state to handle new fields
    return { ...getInitialState(), ...parsed };
  } catch {
    return getInitialState();
  }
}

export function saveState(state: AppState): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function updateTaskProgress(day: number, completed: boolean): AppState {
  const state = loadState();
  const taskIndex = state.tasks.findIndex(t => t.day === day);
  if (taskIndex >= 0) {
    state.tasks[taskIndex] = {
      day,
      completed,
      completedAt: completed ? new Date().toISOString() : undefined,
    };
  }
  saveState(state);
  return state;
}

export function saveNote(day: number, content: string): AppState {
  const state = loadState();
  const existingIndex = state.notes.findIndex(n => n.day === day);

  if (existingIndex >= 0) {
    state.notes[existingIndex] = { day, content, timestamp: new Date().toISOString() };
  } else {
    state.notes.push({ day, content, timestamp: new Date().toISOString() });
  }
  saveState(state);
  return state;
}

export function saveQARecord(record: QARecord): AppState {
  const state = loadState();
  state.qaRecords.push(record);
  saveState(state);
  return state;
}

export function saveApiKey(key: string): AppState {
  const state = loadState();
  state.apiKey = key;
  saveState(state);
  return state;
}

export function getCompletedCount(state: AppState): number {
  return state.tasks.filter(t => t.completed).length;
}

export function getProgressPercentage(state: AppState): number {
  return Math.round((getCompletedCount(state) / tasks.length) * 100);
}
