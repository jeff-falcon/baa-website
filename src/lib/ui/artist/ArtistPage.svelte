<script lang="ts">
	import type { Artist, ArtistHero, CloudinaryImage, Project } from '$lib/types';
	import ProjectThumb from '../project/ProjectThumb.svelte';
	import ArtistHeroComponent from './ArtistHero.svelte';

	export let data: Artist;

	const featuredProject = data.projects?.[0] as Project | undefined;
	const mobileHero: CloudinaryImage | undefined = featuredProject?.image
		? <CloudinaryImage>{ ...featuredProject.image, sizes: { ...featuredProject.image.sizes } }
		: undefined;
	const hero: ArtistHero = {
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
	};
	const projects = data.projects?.length ?? 0 > 1 ? data.projects.slice(1) ?? [] : [];
	console.log({ projects });
</script>

<ArtistHeroComponent data={hero} url="/artists/{data.slug}/{featuredProject?.slug}" />

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

<style>
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
</style>
