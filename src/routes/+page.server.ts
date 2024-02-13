import type { PageServerLoad } from './$types';
import { getPage } from '$lib/sanity';
import type { Page } from '$lib/types';

export const load: PageServerLoad = async () => {
	return (await getPage('home')) as Page;
};
