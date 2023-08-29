import type { PageServerLoad } from './$types';
import { getPage } from '$lib/sanity';

export const load: PageServerLoad = async () => {
	return await getPage('home');
};
