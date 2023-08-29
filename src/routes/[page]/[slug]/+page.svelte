<script lang="ts">
	import type { PageData } from './$types';
	import ProjectComponent from '$lib/ui/project/Project.svelte';
	import { bgColor, pageHasHero } from '$lib/store';
	import { onMount } from 'svelte';
	import { getContrastYIQFromColor } from '$lib/color';

	export let data: PageData;

	onMount(() => {
		pageHasHero.set(false);
		const defaultBg = getComputedStyle(document.documentElement).getPropertyValue('--bg-dark');
		const color = data.project?.bgColor || defaultBg;
		bgColor.set(color);
		document.body.style.setProperty('--page-bg-color', color);
		document.body.className = `bg-is-${
			getContrastYIQFromColor($bgColor) === 'white' ? 'dark' : 'light'
		}`;
		document.body.style.backgroundColor = $bgColor;
	});
</script>

<svelte:head>
	<title>{data.project?.pageTitle ?? 'Work | Bespoke Digital'}</title>
	<meta name="description" content={data.project?.metaDescription || 'Bespoke Digital'} />
</svelte:head>

{#if data.project}
	<ProjectComponent project={data.project} />
{/if}
