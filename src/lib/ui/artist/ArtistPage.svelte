<script lang="ts">
	import type { Artist, ArtistHero, ArtistLink, CloudinaryImage, Project } from '$lib/types';
	import { PortableText, type PortableTextComponents } from '@portabletext/svelte';
	import type { InputValue } from '@portabletext/svelte/ptTypes';
	import ProjectThumb from '../project/ProjectThumb.svelte';
	import ArtistHeroComponent from './ArtistHero.svelte';
	import { onMount } from 'svelte';
	import { artistContactInfo, footerHasContactInfo, isFooterLight, pageHasHero } from '$lib/store';

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

	$: replacedFooter =
		$artistContactInfo && Array.isArray($artistContactInfo)
			? $artistContactInfo.reduce((prev: any, block) => {
					if (block._type === 'block') {
						const blockClone = { ...block };
						if (blockClone.children?.length) {
							blockClone.children = block.children.map((child: any) => {
								let text = child.text;
								if (text.includes('{nickname}')) {
									text = text.replace('{nickname}', nickname);
								}
								return { ...child, text };
							});
						}
						if (block.markDefs?.length) {
							blockClone.markDefs = block.markDefs.map((b: any) => {
								if (b._type === 'link' && b.url?.startsWith('mailto:')) {
									const url = b.url + '?subject=Inquiry for BAA Artist: ' + nickname;
									return { ...b, url };
								} else {
									return b;
								}
							});
						}
						return [...prev, blockClone];
					} else {
						return prev;
					}
			  }, [] as any)
			: null;

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

	function formatUrl(url: string) {
		return url.replace(/^http(s)?:\/\//, '').replace(/\/$/, '');
	}
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
				<h3 class="title">Clients and publications</h3>
				{@html data.clients}
			</div>
		{/if}
		{#if data.links.length}
			<ul class="links">
				{#each data.links as link}
					<li>
						<a href={getArtistLinkUrl(link)} target="_blank"
							><b class="title">{uppercaseFirst(link.name)}</b>
							<span class="value">{link.url ? formatUrl(link.url) : `@${link.username}`}</span></a
						>
					</li>
				{/each}
			</ul>
		{/if}
		{#if replacedFooter}
			<div class="contact">
				<PortableText value={replacedFooter} />
			</div>
		{/if}
	</div>
</section>

<style>
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
	.clients .title {
		text-transform: uppercase;
		font-size: var(--16pt);
		line-height: var(--24pt);
		margin: 0;
		font-weight: bold;
	}
	.links {
		display: flex;
		gap: 24px;
		margin: 40px 0 0;
	}
	.links .value {
		display: none;
	}
	@media (min-width: 720px) {
		.bio {
			grid-template-columns: repeat(12, 1fr);
		}
		.bio .wrap {
			grid-column: 2 / span 7;
			padding-left: 0;
		}
		.clients .title {
			font-size: var(--18pt);
		}
		.links {
			display: block;
			margin: 80px 0 1.25rem;
		}
		.links li {
			margin: 0;
		}
		.links a {
			text-decoration-line: none;
		}
		.links .value {
			display: inline;
			text-decoration-line: underline;
			text-decoration-thickness: 1px;
			text-decoration-color: inherit;
		}
		.projects .pair,
		.projects .trio {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			grid-column: 1 / span 2;
		}
		.projects .single {
			min-height: 500px;
			height: 100vh;
		}
		.projects .single :global(.project) {
			height: 100%;
		}
		.projects .single :global(.project a) {
			padding-top: 0;
			height: 100%;
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
</style>
