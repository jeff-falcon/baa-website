<script lang="ts">
	import type { PageData } from './$types';
	import { bgColor, currentArtist, pageHasHero } from '$lib/store';
	import { onMount } from 'svelte';
	import { getContrastYIQFromColor } from '$lib/color';
	import ArtistPage from '$lib/ui/artist/ArtistPage.svelte';

	export let data: PageData;

	onMount(() => {
		pageHasHero.set(true);
		const defaultBg = getComputedStyle(document.documentElement).getPropertyValue('--bg-dark');
		const color = defaultBg;
		bgColor.set(color);
		document.body.style.setProperty('--page-bg-color', color);
		document.body.className = `bg-is-${
			getContrastYIQFromColor($bgColor) === 'white' ? 'dark' : 'light'
		}`;
		document.body.style.backgroundColor = $bgColor;
		currentArtist.set(data.artist);
		return () => {
			currentArtist.set(undefined);
		};
	});
</script>

<svelte:head>
	<title>{data.artist?.name} | Artists | BAA Global</title>
	{#if data.artist?.metaDescription}
		<meta name="description" content={data.artist.metaDescription} />
	{/if}
</svelte:head>

{#if data.artist}
	{#key data.artist._id}
		<ArtistPage data={data.artist} />
	{/key}
{/if}
