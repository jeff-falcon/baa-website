import { createClient } from '@sanity/client';
import { SANITY_TOKEN, SANITY_DATASET, SANITY_PROJECT_ID } from '$env/static/private';
import type { Artist, ArtistsGrid, ColumnedText, LatestProjects, Page, PageComponents, ArtistHero } from '$lib/types';
import { type HttpError, error } from '@sveltejs/kit';
import { parseArtistFromData, parseCloudinaryImage, parseHeroFromData, parseProjectFromData, parseProjectSlug } from './parse';

const date = new Date().toISOString().split('T')[0];

const client = createClient({
	projectId: SANITY_PROJECT_ID,
	dataset: SANITY_DATASET,
	apiVersion: date,
	token: SANITY_TOKEN,
	useCdn: true
});

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
		footer_has_contact_info,
		components[]{
			_type == 'latest_projects_ref' => @->{
				_type,
				title,
				"projects": projects[]->{
					...,
					"slug": slug.current,
					"tags": tags[]->prefLabel,
					"media": null
				}
			},
			_type == 'artists_grid_ref' => @->{
				name,
				_type,
				show_all == false => {
					"artists": artists[]->{
						...,
						"slug": slug.current,
						"portfolio": portfolio->{
							...,
							"slug": slug.current,
						},
						"featured": featured[]->,
						"projects": projects[]->{
							...,
							"slug": slug.current,
						},
						"tags": tags[]->prefLabel,
					}
				},
				show_all == true && sorting == "alpha" => {
					"artists": *[_type == "artist"] | order(lower(name) asc){
						...,
						"slug": slug.current,
						"portfolio": portfolio->{
							...,
							"slug": slug.current,
						},
						"featured": featured[]->,
						"projects": projects[]->{
							...,
							"slug": slug.current,
						},
						"tags": tags[]->prefLabel,
					}
				},
				show_all == true && sorting == "date" => {
					"artists": *[_type == "artist"] | order(_createdAt desc){
						...,
						"slug": slug.current,
						"portfolio": portfolio->{
							...,
							"slug": slug.current,
						},
						"featured": featured[]->,
						"projects": projects[]->{
							...,
							"slug": slug.current,
						},
						"tags": tags[]->prefLabel,
					}
				},
			},
			_type == 'columned_text_ref' => @->{..., "bgColor": background_color},
		}
	}`;
	try {
		const result = await client.fetch(groq);
		if (!result || !result.length) return error(404, 'Page not found');
		const pageData = result[0];
		const page: Page = {
			_type: 'page',
			_id: pageData._id,
			name: pageData.name,
			bgColor: pageData.bgColor?.value,
			slug: pageData.slug,
			metaDescription: pageData.description,
			hero: parseHeroFromData(pageData.hero),
			components: getComponents(pageData.components),
			footerHasContactInfo: pageData.footer_has_contact_info ?? true,
		};

		const latestProjects = page.components?.filter(c => c._type === 'latest_projects') as LatestProjects[]
		if (latestProjects?.length) {
			console.log('page has latest projects', { latestProjects })
			await getArtistsForProjects(latestProjects)
		}

		return page;
	} catch (err) {
		console.log('fetch error', (err as Error).message);
		return error(403, (err as Error).message);
	}
}

async function getArtistsForProjects(latestProjects: LatestProjects[]) {
	const client = getClient();
	const groq = `*[_type == "artist"]{
			_type,
			_id,
			name,
			"slug": slug.current,
			"portfolio": portfolio->{
				_id,
			},
			projects[]{
				_type == 'project' => @->{
					"projects": [
						_id,
					]
				},
				_type == 'project_pair' => {
					"projects": [
						left->_id,
						right->_id,
					]
				},
				_type == 'project_trio' => {
					"projects": [
						top->_id,
						bottom->_id,					
						side->_id,
					]
				},
			},
		}`;
	const artistsData = await client.fetch(groq);
	for (const artist of artistsData) {
		const projectIds: string[] = []
		if (artist.portfolio?._id) {
			projectIds.push(artist.portfolio._id)
		}
		if (artist.projects) {
			for (const project of artist.projects) {
				projectIds.push(...project.projects)
			}
		}
		if (projectIds.length === 0) continue;


		latestProjects.forEach(lp => {
			const projects = lp.projects.filter(p => projectIds.includes(p._id))
			if (projects.length) {
				const a: Artist = {
					_type: 'artist',
					_id: artist._id,
					clients: '',
					links: [],
					location: '',
					name: artist.name,
					nickname: '',
					projects: [],
					slug: artist.slug,
					tags: [],
				}
				projects.forEach(p => {
					p.name = a.name
					if (p.project?.slug) {
						const slug = a.slug + '/' + parseProjectSlug(a.slug, p.project.slug)
						p.project.slug = slug
					}
					console.log('added artist to project')
				})
			}
		})
	}
}

function getComponents(components: any): PageComponents {
	if (!components) return []
	const comps: PageComponents = []
	for (const component of components) {
		if (component?._type === 'artists_grid') {
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
		} else if (component?._type === 'columned_text') {
			comps.push(component as ColumnedText);
		} else if (component?._type === 'latest_projects') {
			const lp = component as LatestProjects;
			if (lp.projects) {
				lp.projects = lp.projects.map(p => ({
					_type: 'hero',
					_id: p._id,
					name: '',
					kind: p.kind,
					image_desktop: parseCloudinaryImage((p as any).image),
					videoBgSrc: (p as any).thumb_vimeo_src,
					videoBgSrcHd: (p as any).thumb_vimeo_src_hd,
					project: parseProjectFromData(p)
				})).filter(p => p) as ArtistHero[]
			}
			comps.push(lp);
		} else {
			console.log('unknown component', component);
		}
	}
	return comps
}
/* 
async function getAllArtists(orderByAlpha = true): Promise<Artist[]> {
	const client = getClient();
	const groq = `*[_type == "artist"] | order(${orderByAlpha ? 'name asc' : '_createdAt desc'}) {
		...,
		"portfolio": portfolio->,
		"featured": featured->,
		"projects": projects[]->,
		"tags": tags[]->prefLabel,
	}`;
	try {
		const result = await client.fetch(groq);
		const artists = result.map((data: any) => parseArtistFromData(data));
		return artists
	} catch (err) {
		console.log('fetch error', (err as Error).message);
		return []
	}
}
 */