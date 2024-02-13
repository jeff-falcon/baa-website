import { writable } from 'svelte/store';
import type { Artist, Project } from '$lib/types';
import type { InputValue } from '@portabletext/svelte/ptTypes';

type MenuStates = 'open' | 'closed';

export const menuState = writable<MenuStates>('closed');
export const isMenuOpenComplete = writable<boolean>(false);
export const pageHasHero = writable<boolean>(false);
export const footerHasContactInfo = writable<boolean>(true);
export const bgColor = writable<string>('var(--bg-dark)');
export const inputBorderIsRounded = writable<boolean>(false);
export const isFooterLight = writable<boolean>(false);
export const currentArtist = writable<Artist | undefined>(undefined);
export const currentProject = writable<Project | undefined>(undefined);
export const artistContactInfo = writable<InputValue | undefined>(undefined);
