import type { PageServerLoad } from './$types';
import { getClient } from '$lib/sanity';
import type { Artist } from '$lib/types';
import { error, type HttpError } from '@sveltejs/kit';
import { parseArtistFromData } from '$lib/parse';

export const load: PageServerLoad = async ({ params }): Promise<{ artist?: Artist } | HttpError> => {
	console.log('loading work/' + params.slug);

	const client = getClient();
	const groq = `*[_type == "artist" && slug.current == "${params.slug}"]{
			...,
			"slug": slug.current,
			"portfolio": portfolio->{
				...,
				"slug": slug.current,
			},
			"featured": featured[]->,
			projects[]{
				_type == 'project' => @->{
					...,
					"tags": tags[]->prefLabel,
					"slug": slug.current,
				},
				_type == 'project_pair' => {
					_type,
					left->{
						...,
						"tags": tags[]->prefLabel,
						"slug": slug.current,
					},
					right->{
						...,
						"tags": tags[]->prefLabel,
						"slug": slug.current,
					}
				},
				_type == 'project_trio' => {
					_type,
					align,
					top->{
						...,
						"tags": tags[]->prefLabel,
						"slug": slug.current,
					},
					bottom->{
						...,
						"tags": tags[]->prefLabel,
						"slug": slug.current,
					},
					side->{
						...,
						"tags": tags[]->prefLabel,
						"slug": slug.current,
					},
				},
			},
			"tags": tags[]->prefLabel,
		}`;
	const data = await client.fetch(groq);

	if (!data) return error(404, 'Artist not found');

	const projectData = data[0];
	console.log(projectData)

	const artist = parseArtistFromData(projectData)

	if (artist) {
		return { artist }
	} else {
		return error(404, 'Artist not found');
	}

};
