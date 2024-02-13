<script lang="ts">
	import type { ArtistsGrid } from '$lib/types';
	import ArtistThumb from './ArtistThumb.svelte';

	export let data: ArtistsGrid;
</script>

<section class="artists-grid">
	{#each data.artists as artist (artist._id)}
		<ArtistThumb {artist} />
	{/each}
	{#if data.artists.length % 2 == 1}
		<div class="empty" style="background-color: {data.emptyColor ?? 'transparent'}">Hello</div>
	{/if}
</section>

<style>
	.empty {
		display: none;
	}
	@media (min-width: 720px) {
		section {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
		}
		.empty {
			display: block;
		}
	}
</style>
