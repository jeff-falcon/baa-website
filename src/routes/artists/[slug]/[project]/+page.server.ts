import type { PageServerLoad } from './$types';
import { getClient } from '$lib/sanity';
import type { Artist, Project, ProjectMedia, ProjectMediaPair, ProjectMediaTrio } from '$lib/types';
import { error } from '@sveltejs/kit';
import {
	parseCloudinaryImage,
	parseProjectMediaFromData,
	parseArtistFromData,
	mergePortfolioIntoProjects
} from '$lib/parse';

interface ArtistProjectData {
	_type: string;
	slug: string;
	left?: { slug: string };
	right?: { slug: string };
	top?: { slug: string };
	bottom?: { slug: string };
	side?: { slug: string };
}

export const load: PageServerLoad = async ({
	params
}): Promise<{ project?: Project; artist?: Artist }> => {
	const client = getClient();
	const groqArtist = `*[_type == "artist" && slug.current == "${params.slug}"]{
    ...,
    "portfolio": portfolio->{..., "slug": slug.current},
    "featured": null,
    "slug": slug.current,
    "tags": tags[]->prefLabel,
    projects[]{
      _type == 'project' => @->{
        _type,
        "slug": slug.current
      },
      _type == 'project_pair' => {
        _type,
        left->{
          "slug": slug.current,
        },
        right->{
          "slug": slug.current,
        }
      },
      _type == 'project_trio' => {
        _type,
        top->{
          "slug": slug.current,
        },
        bottom->{
          "slug": slug.current,
        },
        side->{
          "slug": slug.current,
        },
      },
    },
  }`;
	let artistData = await client.fetch(groqArtist);

	if (!artistData?.[0]) error(404, 'Artist not found');

	artistData = artistData[0];
	mergePortfolioIntoProjects(artistData);

	const artistProjectsSlugs: string[] =
		artistData.projects
			?.flatMap((p: ArtistProjectData) => {
				if (p._type === 'project') {
					return [p.slug];
				} else if (p._type === 'project_pair') {
					return [p.left?.slug, p.right?.slug];
				} else if (p._type === 'project_trio') {
					return [p.top?.slug, p.bottom?.slug, p.side?.slug];
				}
				return [];
			})
			.filter((slug: string) => Boolean(slug)) ?? [];

	const foundProjectSlug = artistProjectsSlugs.find(
		(slug) => slug === params.project || slug === `${params.slug}-${params.project}`
	);
	if (!foundProjectSlug) {
		error(404, 'Project not found');
	}

	artistData.projects = [];

	const groqProject = `*[_type == "project" && slug.current == "${foundProjectSlug}"]{
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

	const artist = parseArtistFromData(artistData);

	const title = projectData.title || projectData.name;

	const project: Project = {
		_type: 'project',
		_id: projectData._id,
		type: projectData.type === 'portfolio' ? 'portfolio' : 'project',
		pageTitle: `${title} | ${artist?.name ?? ''} | BAA Global`,
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

	return { project, artist };
};
