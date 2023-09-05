import { createClient } from '@sanity/client';
import { SANITY_TOKEN, SANITY_DATASET, SANITY_PROJECT_ID } from '$env/static/private';
import type { Artist, ArtistsGrid, ColumnedText, Page, PageComponents, Project } from '$lib/types';
import { type HttpError, error } from '@sveltejs/kit';
import { parseArtistFromData, parseHeroFromData, parseProjectFromData, parseProjectMediaFromData } from './parse';

export function getClient() {
	return client;
}

export async function getPage(slug: string): Promise<Page | HttpError> {
	if (!slug) return error(404, 'Page not found');

	const client = getClient();
	const groq = `*[_type == "page" && slug.current == "${slug}"]{
		_id,
		name,
		"slug": slug.current,
		description,
		"bgColor": bg_color,
		hero->,
		components[]{
			_type == 'artists_grid_ref' => @->{...},
			_type == 'columned_text_ref' => @->{..., "bgColor": background_color},
		}
	}`;
	try {
		const result = await client.fetch(groq);
		if (!result || !result.length) return error(404, 'Page not found');
		const pageData = result[0];
		console.log({ hero: pageData.hero })
		const page: Page = {
			_type: 'page',
			_id: pageData._id,
			name: pageData.name,
			bgColor: pageData.bgColor?.value,
			slug: pageData.slug,
			metaDescription: pageData.description,
			hero: parseHeroFromData(pageData.hero),
			components: getComponents(pageData.components)
		};

		return page;
	} catch (err) {
		console.log('fetch error', (err as Error).message);
		return error(403, (err as Error).message);
	}
}

function getComponents(components: any): PageComponents {
	if (!components) return []
	const comps: PageComponents = []
	for (const component of components) {
		if (component._type === 'artists_grid') {
			const artists: Artist[] = []
			if (component.artists && Array.isArray(component.artists)) {
				for (const artist of component.artists) {
					const p = parseArtistFromData(artist)
					if (p) artists.push(p)
				}
			}
			const grid: ArtistsGrid = {
				_type: 'artists_grid',
				name: component.name,
				artists
			};
			comps.push(grid);
		} else if (component._type === 'columned_text') {
			comps.push(component as ColumnedText);
		} else {
			console.log('unknown component', component);
		}
	}
	return comps
}

const date = new Date().toISOString().split('T')[0];

const client = createClient({
	projectId: SANITY_PROJECT_ID,
	dataset: SANITY_DATASET,
	apiVersion: date,
	token: SANITY_TOKEN,
	useCdn: true
});
