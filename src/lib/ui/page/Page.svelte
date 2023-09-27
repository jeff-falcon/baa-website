<script lang="ts">
	import type { Page, ProjectMedia } from '$lib/types';
	import { onMount } from 'svelte';
	import Hero from './Hero.svelte';
	import { bgColor, footerHasContactInfo, pageHasHero } from '$lib/store';
	import ColumnedText from '../content/ColumnedText.svelte';
	import { getContrastYIQFromColor } from '$lib/color';
	import ArtistsGrid from '../artist/ArtistsGrid.svelte';
	import LatestProjects from '../project/LatestProjects.svelte';

	export let data: Page;

	const hero = data.hero;
	const hasHero = Boolean(hero || data.components?.[0]._type === 'latest_projects');

	onMount(() => {
		console.log({ data });
		pageHasHero.set(hasHero);
		const defaultBg = getComputedStyle(document.documentElement).getPropertyValue('--bg-dark');
		const color = data.bgColor || defaultBg;
		bgColor.set(color);
		document.body.style.setProperty('--page-bg-color', color);
		document.body.className = `bg-is-${
			getContrastYIQFromColor($bgColor) === 'white' ? 'dark' : 'light'
		}`;
		document.body.style.backgroundColor = $bgColor;
		footerHasContactInfo.set(data.footerHasContactInfo);
	});

	function isVideoPlayer(component: ProjectMedia) {
		return component._type === 'project_media' && component.kind === 'video-player';
	}
</script>

<svelte:head>
	<title>{data.name ?? 'Home'} | BAA Global</title>
	<meta name="description" content={data.metaDescription ?? 'BAA Global'} />
</svelte:head>

<div class="page" class:hasHero>
	{#if hero}
		<Hero data={hero} />
	{/if}
	{#if data.components}
		{#each data.components as component (component)}
			{#if component._type === 'artists_grid'}
				<ArtistsGrid data={component} />
			{/if}
			{#if component._type === 'columned_text'}
				<ColumnedText data={component} />
			{/if}
			{#if component._type === 'latest_projects'}
				<LatestProjects data={component} />
			{/if}
		{/each}
	{/if}
</div>

<style>
	.page {
		--section-spacing: 3rem;
	}
	.page:not(.hasHero) {
		padding-top: var(--top-nav-height);
	}
	@media (min-width: 720px) {
		.page {
			--section-spacing: 4rem;
		}
	}
	.page :global(section:first-of-type[class*='project-grid']) {
		padding-top: 0;
	}
</style>
