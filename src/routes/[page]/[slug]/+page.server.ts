import type { PageServerLoad } from './$types';
import { getClient } from '$lib/sanity';
import type { Project, ProjectMedia, ProjectMediaPair } from '$lib/types';
import { error, type HttpError } from '@sveltejs/kit';
import { parseCloudinaryImage, parseProjectFromData, parseProjectMediaFromData } from '$lib/parse';

export const load: PageServerLoad = async ({ params }): Promise<{ project?: Project } | HttpError> => {
	if (params.page === 'work') {
		console.log('loading work/' + params.slug);

		const client = getClient();
		const groq = `*[_type == "project" && slug.current == "${params.slug}"]{
			...,
			media[]{
				_type == 'item' => @->,
				_type == 'item_pair' => {
					_type,
					left->,
					right->
				},
			},
			"tags": tags[]->,
			"relatedProjects": *[_type == "project" && count(tags[@._ref in ^.^.tags[]._ref]) > 0 && slug.current != "${params.slug}"]{
				_type,
				_id,
				image,
				kind,
				"videoBgSrc": thumb_vimeo_src,
				"videoBgSrcHd": thumb_vimeo_src_hd,
				"shortName": short_name,
				"slug": slug.current,
				"title": title,
				"client": client,
			}
		}`;
		const data = await client.fetch(groq);
		const projectData = data[0];
		const mediaList: Array<ProjectMedia | ProjectMediaPair> = []
		if (projectData.media) {
			for (const media of projectData.media) {
				if (media._type === 'project_media') {
					const item = parseProjectMediaFromData(media);
					if (item) mediaList.push(item)
				}
				if (media._type === 'item_pair') {
					const left = parseProjectMediaFromData(media.left)
					const right = parseProjectMediaFromData(media.right)
					if (!left && !right) {
						continue;
					}
					if (!left || !right) {
						const item = left ?? right;
						if (item) mediaList.push(item)
					} else {
						mediaList.push(<ProjectMediaPair>{
							_type: 'item_pair',
							left,
							right
						});
					}
				}
			}
		}
		const title = projectData.title || projectData.name;
		const project: Project = {
			_type: 'project',
			pageTitle: title + ' | Work | Bespoke Digital',
			name: projectData.name,
			title: title,
			metaDescription: projectData.meta_description,
			shortName: projectData.short_name || title || '',
			slug: projectData.slug.current,
			descriptionIntro: projectData.description_intro,
			description: projectData.description,
			client: projectData.client,
			credits: projectData.credits ?? [],
			image: parseCloudinaryImage(projectData.image, projectData.image_mobile),
			videoBgSrc: projectData.thumb_vimeo_src,
			videoBgSrcHd: projectData.thumb_vimeo_src_hd,
			media: mediaList,
			bgColor: projectData.bg_color?.value,
			relatedProjects: projectData.show_related_projects !== false ? projectData.relatedProjects ?? [] : [],
			relatedProjectsBgColor: projectData.related_projects_bg_color?.value,
			showRelatedProjects: projectData.show_related_projects !== false,
		};
		if (project.relatedProjects?.length) {
			project.relatedProjects.forEach(p => {
				p.image = parseCloudinaryImage(p.image)
			})
			project.relatedProjects.sort(() => {
				return Math.random() - 0.5
			})
			project.relatedProjects = project.relatedProjects.slice(0, project.relatedProjects.length < 4 ? 2 : 4);
		}

		return { project };
	}

	return error(404, 'Page not found');
};
