<script lang="ts">
	import type { PageData } from './$types';
	import ProjectComponent from '$lib/ui/project/Project.svelte';
	import { bgColor, currentArtist, currentProject, pageHasHero } from '$lib/store';
	import { onMount } from 'svelte';
	import { getContrastYIQFromColor } from '$lib/color';

	export let data: PageData;

	onMount(() => {
		const firstIsFullBleed =
			(data.project?.media?.[0]._type === 'project_media' &&
				data.project?.media?.[0].kind !== 'video-player') ||
			data.project?.media?.[0]._type !== 'project_media';
		pageHasHero.set(firstIsFullBleed);
		console.log({ firstIsFullBleed });
		const defaultBg = getComputedStyle(document.documentElement).getPropertyValue('--bg-light');
		const color = data.project?.bgColor || defaultBg;
		bgColor.set(color);
		document.body.style.setProperty('--page-bg-color', color);
		document.body.className = `bg-is-${
			getContrastYIQFromColor($bgColor) === 'white' ? 'dark' : 'light'
		}`;
		document.body.style.backgroundColor = $bgColor;
		currentArtist.set(data.artist);
		currentProject.set(data.project);
		return () => {
			pageHasHero.set(false);
			currentArtist.set(undefined);
			currentProject.set(undefined);
		};
	});
</script>

<svelte:head>
	<title>{data.project?.pageTitle ?? 'BAA Global'}</title>
	<meta name="description" content={data.project?.metaDescription || 'BAA Global'} />
</svelte:head>

{#if data.project}
	<ProjectComponent project={data.project} artist={data.artist} />
{/if}
