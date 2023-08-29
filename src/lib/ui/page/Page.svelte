<script lang="ts">
	import type { Page, ProjectMedia } from '$lib/types';
	import ProjectGrid from '$lib/ui/project/ProjectGrid.svelte';
	import { onMount } from 'svelte';
	import LogoGrid from '../logos/LogoGrid.svelte';
	import Hero from './Hero.svelte';
	import { bgColor, footerHasContactForm, pageHasHero } from '$lib/store';
	import ProjectMediaComponent from '../project/ProjectMediaComponent.svelte';
	import TextOnly from '../content/TextOnly.svelte';
	import ColumnedText from '../content/ColumnedText.svelte';
	import ClientList from '../content/ClientList.svelte';
	import Form from '../form/Form.svelte';
	import { getContrastYIQFromColor } from '$lib/color';

	export let data: Page;

	const randomHeroIndex = Math.floor(Math.random() * (data.heros?.heros.length ?? 0));
	const hasHero = data.heros?.heros != null && data.heros?.heros.length > 0;
	const hero = hasHero ? data.heros!.heros[randomHeroIndex] : null;

	onMount(() => {
		pageHasHero.set(hasHero);
		const defaultBg = getComputedStyle(document.documentElement).getPropertyValue('--bg-dark');
		const color = data.bgColor || defaultBg;
		console.log('page background color', data.bgColor || defaultBg);
		bgColor.set(color);
		document.body.style.setProperty('--page-bg-color', color);
		document.body.className = `bg-is-${
			getContrastYIQFromColor($bgColor) === 'white' ? 'dark' : 'light'
		}`;
		document.body.style.backgroundColor = $bgColor;
		footerHasContactForm.set(data.footerHasContactForm);
	});

	function isVideoPlayer(component: ProjectMedia) {
		return component._type === 'project_media' && component.kind === 'video-player';
	}
</script>

<svelte:head>
	<title>{data.name ?? 'Home'} | Bespoke Digital</title>
	<meta name="description" content={data.metaDescription ?? 'Bespoke Digital'} />
</svelte:head>

<div class="page" class:hasHero>
	{#if hero}
		<Hero data={hero} />
	{/if}
	{#if data.components}
		{#each data.components as component (component)}
			{#if component._type === 'project_grid'}
				<ProjectGrid data={component} />
			{/if}
			{#if component._type === 'logo_grid'}
				<LogoGrid data={component} />
			{/if}
			{#if component._type === 'project_media'}
				<section
					class="project-media-single gutter {isVideoPlayer(component) ? 'is-video-player' : ''}"
				>
					<ProjectMediaComponent media={component} />
				</section>
			{/if}
			{#if component._type === 'text_only'}
				<TextOnly data={component} />
			{/if}
			{#if component._type === 'columned_text'}
				<ColumnedText data={component} />
			{/if}
			{#if component._type === 'client_list'}
				<ClientList data={component} />
			{/if}
			{#if component._type === 'form'}
				<Form data={component} />
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
	.project-media-single {
		padding-top: var(--section-spacing);
		padding-bottom: var(--section-spacing);
	}
	@media (min-width: 720px) {
		.page {
			--section-spacing: 4rem;
		}
	}
	@media (max-width: 719px) {
		.is-video-player.gutter {
			padding-left: 0;
			padding-right: 0;
		}
	}
	.page :global(section:first-of-type[class*='project-grid']) {
		padding-top: 0;
	}
</style>
