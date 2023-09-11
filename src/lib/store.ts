import { writable } from 'svelte/store';
import type { Artist, Project } from '$lib/types';

type MenuStates = 'open' | 'closed';

export const menuState = writable<MenuStates>('closed');
export const isMenuOpenComplete = writable<boolean>(false);
export const pageHasHero = writable<boolean>(false);
export const footerHasContactForm = writable<boolean>(true);
export const bgColor = writable<string>('var(--bg-dark)');
export const inputBorderIsRounded = writable<boolean>(false);
export const isFooterLight = writable<boolean>(false);
export const currentArtist = writable<Artist | undefined>(undefined);
export const currentProject = writable<Project | undefined>(undefined);
