<script lang="ts">
	import type { Artist, ArtistHero, ArtistLink, CloudinaryImage, Project } from '$lib/types';
	import { PortableText } from '@portabletext/svelte';
	import ProjectThumb from '../project/ProjectThumb.svelte';
	import ArtistHeroComponent from './ArtistHero.svelte';
	import { onMount } from 'svelte';
	import { footerHasContactInfo, isFooterLight, pageHasHero } from '$lib/store';

	export let data: Artist;

	const featuredProject = data.projects?.[0] as Project | undefined;
	const mobileHero: CloudinaryImage | undefined = featuredProject?.image
		? <CloudinaryImage>{ ...featuredProject.image, sizes: { ...featuredProject.image.sizes } }
		: undefined;
	const hero: ArtistHero | undefined =
		featuredProject?._type === 'project'
			? {
					_type: 'hero',
					_id: data._id,
					name: data.name,
					subtitle: data.tags?.join(', ') ?? '',
					kind: featuredProject?.kind,
					image_desktop: featuredProject?.image,
					image_mobile: mobileHero,
					videoBgSrc: featuredProject?.videoBgSrc,
					videoBgSrcHd: featuredProject?.videoBgSrcHd,
					project: featuredProject
			  }
			: undefined;
	const projects = data.projects?.length ?? 0 > 1 ? data.projects.slice(1) ?? [] : [];
	const nickname = data.nickname || data.name;

	function uppercaseFirst(str: string) {
		return str.charAt(0).toUpperCase() + str.slice(1);
	}
	function getArtistLinkUrl(link: ArtistLink) {
		if (link.name === 'website') {
			return link.url;
		}
		switch (link.name) {
			case 'instagram':
				return `https://instagram.com/${link.username}`;
			case 'twitter':
				return `https://twitter.com/${link.username}`;
			case 'facebook':
				return `https://facebook.com/${link.username}`;
			case 'linkedin':
				return `https://linkedin.com/in/${link.username}`;
			case 'behance':
				return `https://behance.net/${link.username}`;
		}
	}

	onMount(() => {
		pageHasHero.set(true);
		isFooterLight.set(true);
		footerHasContactInfo.set(false);
		return () => {
			isFooterLight.set(false);
			pageHasHero.set(false);
		};
	});
</script>

{#if hero}
	<ArtistHeroComponent data={hero} url="/artists/{data.slug}/{featuredProject?.slug}" />
{/if}

{#if projects.length}
	<section class="projects">
		{#each projects as project (project)}
			{#if project._type === 'project'}
				<div class="single">
					<ProjectThumb {project} url="/artists/{data.slug}/{project.slug}" />
				</div>
			{/if}
			{#if project._type === 'project_pair'}
				<div class="pair">
					<ProjectThumb project={project.left} url="/artists/{data.slug}/{project.left.slug}" />
					<ProjectThumb project={project.right} url="/artists/{data.slug}/{project.right.slug}" />
				</div>
			{/if}
			{#if project._type === 'project_trio'}
				<div class="trio {project.align}">
					<ProjectThumb project={project.top} url="/artists/{data.slug}/{project.top.slug}" />
					<ProjectThumb project={project.bottom} url="/artists/{data.slug}/{project.bottom.slug}" />
					<ProjectThumb project={project.side} url="/artists/{data.slug}/{project.side.slug}" />
				</div>
			{/if}
		{/each}
	</section>
{/if}
<section class="bio gutter is-light">
	<div class="wrap">
		{#if data.bio}
			<div class="long-bio">
				<PortableText value={data.bio} />
			</div>
		{/if}
		{#if data.clients}
			<div class="clients">
				<b>Clients and publications:</b>
				{data.clients}
			</div>
		{/if}
		{#if data.links.length}
			<ul class="links">
				{#each data.links as link}
					<li>
						<b>{uppercaseFirst(link.name)}</b>
						<a href={getArtistLinkUrl(link)} target="_blank">{link.url ?? `@${link.username}`}</a>
					</li>
				{/each}
			</ul>
		{/if}
		<div class="contact">
			Interested in working with {nickname},<br />
			please email
			<a href="mailto:workwith@baa.com?subject=Interested in {nickname}">workwith@baa.com</a>
		</div>
	</div>
</section>

<style>
	@media (min-width: 720px) {
		.projects {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
		}
		.projects .pair,
		.projects .trio {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			grid-column: 1 / span 2;
		}
		.projects .trio.left :global(.project:nth-of-type(1)) {
			grid-column: 2 / span 1;
			grid-row: 1;
		}
		.projects .trio.left :global(.project:nth-of-type(2)) {
			grid-column: 2 / span 1;
			grid-row: 2;
		}
		.projects .trio.left :global(.project:nth-of-type(3)) {
			grid-column: 1 / span 1;
		}
		.projects .trio.right :global(.project:nth-of-type(1)) {
			grid-column: 1 / span 1;
			grid-row: 1;
		}
		.projects .trio.right :global(.project:nth-of-type(2)) {
			grid-column: 1 / span 1;
			grid-row: 2;
		}
		.projects .trio.right :global(.project:nth-of-type(3)) {
			grid-column: 2 / span 1;
		}
		.projects .trio :global(.project:nth-of-type(3)) {
			grid-row: 1 / span 2;
			position: relative;
		}
		.projects .trio :global(.project:nth-of-type(3) a) {
			padding-top: 0;
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
		}
	}
	.links {
		list-style: none;
		padding: 0;
	}
	.bio {
		background: var(--bg-light);
		color: var(--text-dark);
		padding-top: 9rem;
		padding-bottom: 9rem;
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: var(--gutter-lg);
	}
	.bio .wrap {
		grid-column: 1 / span 4;
	}
	@media (min-width: 720px) {
		.bio {
			grid-template-columns: repeat(12, 1fr);
		}
		.bio .wrap {
			grid-column: 2 / span 7;
			padding-left: 0;
		}
	}
</style>
