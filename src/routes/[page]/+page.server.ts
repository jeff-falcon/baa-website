import type { PageServerLoad } from './$types';
import { getPage } from '$lib/sanity';
import type { Page } from '$lib/types';

export const load: PageServerLoad = async ({ params }) => {
	return (await getPage(params.page)) as Page;
};
