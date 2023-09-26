<script lang="ts">
	import type { LatestProjects } from '$lib/types';
	import ArtistHero from '../artist/ArtistHero.svelte';

	export let data: LatestProjects;
</script>

<section class="latest-projects">
	{#each data.projects as hero, index (hero)}
		<ArtistHero
			data={hero}
			url="/artists/{hero.project?.slug}"
			doParallax={false}
			align={index % 2 === 1 ? 'left' : 'right'}
		/>
	{/each}
</section>

<style>
	.latest-projects {
		padding: 0;
	}
	.latest-projects :global(.hero) {
		min-height: 650px;
	}
</style>
