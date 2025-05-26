import { writable } from 'svelte/store';

export const userId = writable<number | null>(null);
export const tillSessionId = writable<number | null>(null);