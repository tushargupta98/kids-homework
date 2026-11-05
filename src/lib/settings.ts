import { createStore } from './storage';

interface Settings {
  sound: boolean;
  /** Name of the chosen read-aloud voice; empty means pick the best one automatically. */
  voice?: string;
}

const store = createStore<Settings>('hoot:settings:v1', { sound: true });

export const useSettings = store.useStore;
export const getSettings = store.get;
export const setVoice = (voice: string) => store.set({ ...store.get(), voice });
export const setSound = (sound: boolean) => store.set({ ...store.get(), sound });
