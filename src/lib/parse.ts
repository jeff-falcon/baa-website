import type {
	Project,
	ProjectMedia,
	CloudinaryImage,
	Hero,
	Artist,
	HeroArtist,
	ProjectPair,
	ProjectTrio
} from '$lib/types';

export function parseCloudinaryImage(
	image: any,
	mobileImage?: any,
	useOriginalQuality = false,
	isSingle = true
) {
	if (!image) return undefined;
	const originalUrl = image.derived?.[0]?.secure_url ?? image.secure_url;
	if (image.format === 'gif') {
		const url = image.secure_url
			.replace(/\.gif$/, '.webp')
			.replace(/\/upload\/v/, '/upload/fl_awebp/v');
		return {
			url,
			sizes: {
				sm: url,
				md: url,
				lg: url
			},
			width: image.width,
			height: image.height
		};
	}
	const url: string =
		image.derived?.[0]?.secure_url ??
		image.secure_url.replace(/\/upload\/v/, '/upload/f_auto,q_auto:best/v');
	const matches = url.match(/\/upload\/(.*?)(w_\d+)(.*)\/v/);
	const img: CloudinaryImage = {
		url,
		sizes: {
			sm: matches?.length ? url : url.replace(/\/upload\/(.*?)\/v(\d+)/, '/upload/$1,w_900/v$2'),
			md: matches?.length ? url : url.replace(/\/upload\/(.*?)\/v(\d+)/, '/upload/$1,w_1600/v$2'),
			lg: useOriginalQuality
				? originalUrl
				: matches?.length
					? url
					: url.replace(/\/upload\/(.*?)\/v(\d+)/, `/upload/$1,w_${isSingle ? 32 : 16}00/v$2`)
		},
		width: image.width,
		height: image.height
	};
	if (mobileImage) {
		const mobileUrl: string =
			mobileImage.derived?.[0]?.secure_url ??
			mobileImage.secure_url.replace(/\/upload\/v/, '/upload/f_auto,q_auto:best,w_900/v');
		if (img.sizes) {
			img.sizes.sm = mobileUrl;
		}
	}
	return img;
}

export function parseProjectMediaFromData(project: any, isSingle = true): ProjectMedia | undefined {
	if (project?._type !== 'project_media') return undefined;
	const useOriginalQuality = project.use_original_quality ?? false;
	const image = parseCloudinaryImage(
		project.image,
		project.image_mobile,
		useOriginalQuality,
		isSingle
	);
	const media: ProjectMedia = {
		_type: 'project_media',
		_key: project._id as string,
		name: project.name as string,
		image,
		kind: project.kind as ProjectMedia['kind'],
		videoPlayerSrc: (project.vimeo_player_src as string) || '',
		videoBgSrc: (project.thumb_vimeo_src as string) || '',
		videoBgSrcHd: (project.thumb_vimeo_src_hd as string) || '',
		useOriginalQuality,
		autoplay: project.autoplay ?? false,
		fillContainer: project.fill_container ?? false
	};
	return media;
}

export function parseArtistFromData(data: any) {
	if (data?._type !== 'artist') return undefined;
	const artist: Artist = {
		_type: 'artist',
		_id: data._id,
		name: data.name,
		slug: data.slug,
		bio: data.bio,
		clients: data.clients?.replace(/\n/g, '<br/>'),
		links: data.links,
		featured: data.featured?.map((p: any) => parseProjectMediaFromData(p)).filter((p: any) => p),
		portfolio: parseProjectFromData(data.portfolio),
		projects: parseArtistProjectsFromData(data.slug, data.projects),
		nickname: data.nickname,
		tags: data.tags ?? [],
		location: data.location
	};
	mergePortfolioIntoProjects(artist);
	return artist;
}

export function mergePortfolioIntoProjects(artist: Artist) {
	if (artist.portfolio) {
		const { portfolio } = artist;
		portfolio.title = 'Portfolio';
		portfolio.shortName = 'Portfolio';
		portfolio.slug = parseProjectSlug(artist.slug, portfolio.slug);

		if (!artist.projects) {
			artist.projects = [portfolio];
		} else {
			artist.projects.unshift(portfolio);
		}
		artist.portfolio = undefined;
	}
}

export function parseArtistProjectsFromData(artistSlug: string, data: any) {
	const projects: Array<Project | ProjectPair | ProjectTrio> | undefined = data
		?.map((p: any) => {
			if (p?._type === 'project_trio') {
				const top = parseProjectFromData(p.top, false);
				const bottom = parseProjectFromData(p.bottom, false);
				const side = parseProjectFromData(p.side, false);
				if (top && bottom && side) {
					top.slug = parseProjectSlug(artistSlug, top.slug);
					bottom.slug = parseProjectSlug(artistSlug, bottom.slug);
					side.slug = parseProjectSlug(artistSlug, side.slug);
					const trio: ProjectTrio = {
						_type: 'project_trio',
						align: p.align,
						top,
						bottom,
						side
					};
					return trio;
				}
			} else if (p?._type === 'project_pair') {
				const left = parseProjectFromData(p.left, false);
				const right = parseProjectFromData(p.right, false);
				if (left && right) {
					left.slug = parseProjectSlug(artistSlug, left.slug);
					right.slug = parseProjectSlug(artistSlug, right.slug);
					const pair: ProjectPair = {
						_type: 'project_pair',
						left,
						right
					};
					return pair;
				}
			} else if (p?._type === 'project') {
				if (p?.hidden_from_artist_page === true) {
					return undefined;
				}
				const project = parseProjectFromData(p);
				if (project) {
					project.slug = parseProjectSlug(artistSlug, project.slug);
				}
				return project;
			}
			return null;
		})
		.filter((p: any) => p != null);
	return projects ?? [];
}

export function parseProjectFromData(data: any, isSingle = true) {
	if (data?._type !== 'project') return undefined;
	const project: Project = {
		_type: 'project',
		_id: data._id,
		type: data.type === 'portfolio' ? 'portfolio' : 'project',
		pageTitle: data.name,
		name: data.name,
		title: data.title || data.name,
		metaDescription: data.meta_description,
		shortName: data.short_name || data.title || data.name || '',
		slug: data.slug ?? '',
		description: data.description,
		descriptionIntro: data.description_intro,
		client: data.client,
		kind: data.kind,
		image: parseCloudinaryImage(data.image, null, false, isSingle),
		videoBgSrc: data.thumb_vimeo_src,
		videoBgSrcHd: data.thumb_vimeo_src_hd,
		bgColor: data.bg_color?.value,
		tags: data.tags ?? []
	};
	return project;
}

export function parseHeroFromData(data: any) {
	if (Boolean(data?._type) === false) return undefined;
	const stillDuration = data.still_duration ? Number(data.still_duration) : 4;
	const hero: Hero = {
		_type: 'hero',
		name: data.title,
		subtitle: data.subtitle,
		artists: data.artists?.map((a: any) => parseHeroArtistFromData(a, stillDuration)),
		scrollInstructions: data.scroll_instructions
	};
	return hero;
}

export function parseHeroArtistFromData(data: any, stillDuration: number) {
	const artist: HeroArtist = {
		name: data.artist,
		image: parseCloudinaryImage(data.image_desktop, data.image_mobile),
		kind: data.kind === 'video-bg' ? 'video-bg' : 'image',
		videoBgSrc: data.thumb_vimeo_src,
		videoBgSrcHd: data.thumb_vimeo_src_hd,
		stillDuration
	};
	return artist;
}

export function parseProjectSlug(artistSlug: string, projectSlug: string) {
	if (projectSlug?.startsWith(artistSlug + '-')) {
		return projectSlug.slice(artistSlug.length + 1);
	}
	return projectSlug;
}
