import { writable } from "svelte/store";

export const viewTitleStore = writable<{title: string, subtitle?: string, showBackArrow?: boolean}>({title: 'Nadpis'});