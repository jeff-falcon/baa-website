import type { PageServerLoad } from './$types';
import { getClient } from '$lib/sanity';
import type { Artist, Project, ProjectMedia, ProjectMediaPair, ProjectMediaTrio } from '$lib/types';
import { parseCloudinaryImage, parseProjectMediaFromData } from '$lib/parse';

export const load: PageServerLoad = async ({
	params
}): Promise<{ project?: Project; artist?: Artist }> => {
	const client = getClient();

	const groqProject = `*[_type == "project" && (slug.current == "${params.slug}")]{
			...,
			media[]{
				_type == 'item' => @->,
				_type == 'item_pair' => {
					_type,
					left->,
					right->
				},
				_type == 'item_trio' => {
					_type,
					top->,
					bottom->,
					side->,
          align
				},
			},
			"tags": tags[]->prefLabel
		}`;
	const data = await client.fetch(groqProject);
	const projectData = data[0];
	const mediaList: Array<ProjectMedia | ProjectMediaPair | ProjectMediaTrio> = [];
	if (projectData.media) {
		for (const media of projectData.media) {
			if (media._type === 'project_media') {
				const item = parseProjectMediaFromData(media);
				if (item) mediaList.push(item);
			}
			if (media._type === 'item_pair') {
				const left = parseProjectMediaFromData(media.left, false);
				const right = parseProjectMediaFromData(media.right, false);
				if (!left && !right) {
					continue;
				}
				if (!left || !right) {
					const item = left ?? right;
					if (item) mediaList.push(item);
				} else {
					mediaList.push(<ProjectMediaPair>{
						_type: 'item_pair',
						left,
						right
					});
				}
			}
			if (media._type === 'item_trio') {
				const top = parseProjectMediaFromData(media.top, false);
				const bottom = parseProjectMediaFromData(media.bottom, false);
				const side = parseProjectMediaFromData(media.side, false);
				if (!top || !bottom || !side) {
					continue;
				}
				mediaList.push(<ProjectMediaTrio>{
					_type: 'item_trio',
					top,
					bottom,
					side
				});
			}
		}
	}

	const title = projectData.title || projectData.name;

	const project: Project = {
		_type: 'project',
		_id: projectData._id,
		type: projectData.type === 'portfolio' ? 'portfolio' : 'project',
		pageTitle: `${title} | BAA Global`,
		name: projectData.name,
		title,
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
		relatedProjects: [],
		showRelatedProjects: false,
		tags: projectData.tags ?? []
	};

	return { project };
};
