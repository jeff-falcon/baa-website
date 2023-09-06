<script lang="ts">
	import type { Artist, ArtistHero, CloudinaryImage } from '$lib/types';
	import ProjectThumb from '../project/ProjectThumb.svelte';
	import ArtistHeroComponent from './ArtistHero.svelte';

	export let data: Artist;

	const featuredProject = data.projects?.[0];
	const mobileHero: CloudinaryImage | undefined = featuredProject?.image
		? <CloudinaryImage>{ ...featuredProject.image, sizes: { ...featuredProject.image.sizes } }
		: undefined;
	const hero: ArtistHero = {
		_type: 'hero',
		_id: data._id,
		name: data.name,
		subtitle: data.tags?.join(', ') ?? '',
		kind: featuredProject.kind,
		image_desktop: featuredProject.image,
		image_mobile: mobileHero,
		videoBgSrc: featuredProject.videoBgSrc,
		videoBgSrcHd: featuredProject.videoBgSrcHd,
		project: featuredProject
	};
	const projects = data.projects?.length ?? 0 > 1 ? data.projects.slice(1) ?? [] : [];
</script>

<ArtistHeroComponent data={hero} url="/artists/{data.slug}/{featuredProject?.slug}" />

{#if projects.length}
	<section class="projects">
		{#each projects as project (project)}
			<ProjectThumb {project} url="/artists/{data.slug}/{project.slug}" />
		{/each}
	</section>
{/if}

<style>
	.projects {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
	}
</style>
