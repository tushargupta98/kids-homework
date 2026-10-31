import { createStore } from './storage';

interface Settings {
  sound: boolean;
}

const store = createStore<Settings>('hoot:settings:v1', { sound: true });

export const useSettings = store.useStore;
export const getSettings = store.get;
export const setSound = (sound: boolean) => store.set({ ...store.get(), sound });
