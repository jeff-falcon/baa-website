import type { InputValue } from '@portabletext/svelte/ptTypes';

export interface CloudinaryImage {
	url: string;
	sizes?: {
		sm: string;
		md: string;
		lg: string;
	};
	width: number;
	height: number;
}

export interface Credit {
	name: string;
	credit: string;
}

export interface Project {
	_type: 'project';
	name: string;
	title: string;
	shortName: string;
	metaDescription: string;
	slug: string;
	pageTitle?: string;
	kind?: 'image' | 'video-bg';
	description?: InputValue;
	descriptionIntro?: InputValue;
	client?: string;
	credits?: Credit[],
	image?: CloudinaryImage;
	videoBgSrc?: string;
	videoBgSrcHd?: string;
	media?: Array<ProjectMedia | ProjectMediaPair>;
	bgColor?: string
	tags?: string[];
	relatedProjects?: Project[];
	showRelatedProjects?: boolean;
	relatedProjectsBgColor?: string;
}
export interface ProjectGrid {
	_type: 'project_grid';
	name: string;
	title?: string;
	useFeature: boolean;
	moreLink?: {
		buttonTitle: string;
		url: string
	}
	projects: Project[];
}
export interface Artist {
	_type: 'artist';
	_id: string;
	name: string;
	nickname: string;
	metaDescription?: string;
	slug: string;
	tags: string[];
	location: string;
	bio: InputValue;
	clients: string;
	links: ArtistLink[];
	featured?: ProjectMedia[];
	portfolio?: Project;
	projects: Project[];
}

export interface ArtistLink {
	title: string;
	url?: string;
	username?: string;
}

export interface ArtistsGrid {
	_type: 'artists_grid';
	name: string;
	artists: Artist[];
}
export interface Hero {
	_type: 'hero';
	name: string;
	subtitle?: string;
	artists: HeroArtist[];
	scrollInstructions: string;
}

export interface HeroArtist {
	name: string;
	kind?: 'image' | 'video-bg';
	image?: CloudinaryImage;
	videoBgSrc?: string;
	videoBgSrcHd?: string;
}

export type PageComponents = Array<ArtistsGrid | ColumnedText>

export interface Page {
	_type: 'page';
	_id: string;
	name: string;
	bgColor?: string,
	slug: string;
	metaDescription?: string;
	hero?: Hero;
	components?: PageComponents;
}

export interface ProjectMedia {
	_type: 'project_media';
	_key: string;
	name: string;
	image?: CloudinaryImage;
	kind?: 'image' | 'video-bg' | 'video-player';
	videoPlayerSrc?: string;
	videoBgSrc?: string;
	videoBgSrcHd?: string;
	useOriginalQuality: boolean;
	autoplay: boolean;
}

export interface ProjectMediaPair {
	_type: 'item_pair';
	left: ProjectMedia;
	right: ProjectMedia;
}

export interface Social {
	name: string
	_type: 'social'
	url: string
	icon: string
}

export interface Location {
	name: string
	_type: 'location'
	address: string
	email: string
	timezone: string
}

export interface Config {
	_type: 'config';
	socials: { name: string, links: Social[] }
}

export interface LogoGrid {
	_type: 'logo_grid';
	title: string;
	desktop: string;
	mobile: string;
	color: string;
	mobileMaxWidth: number
	desktopMaxWidth: number
}

export interface TextOnly {
	_type: 'text_only';
	title: string;
	body: InputValue;
	bgColor: SectionBackgroundColor
}

export interface ColumnedText {
	_type: 'columned_text';
	title: string;
	borderedTitle: boolean;
	body: {
		title: string;
		body: InputValue;
	}[];
	bgColor: SectionBackgroundColor
}

export interface ClientList {
	_type: 'client_list';
	title: string;
	clients: string[];
	bgColor: SectionBackgroundColor
}

export interface Form {
	_type: 'form';
	_id: string;
	title: string;
	body: InputValue;
	form: FormType;
	bgColor: SectionBackgroundColor
}

export type FormType = 'contact' | 'job'
export type SectionBackgroundColor = 'transparent' | 'dark' | 'darker'