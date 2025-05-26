import { writable } from 'svelte/store';
import type { IFrontEndUser } from '../interfaces/user';

export const userStore = writable<IFrontEndUser | null>(null);
export const tillSessionIdStore = writable<number | null>(null);