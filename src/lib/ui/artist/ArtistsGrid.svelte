<script lang="ts">
	import type { ArtistsGrid } from '$lib/types';
	import ArtistThumb from './ArtistThumb.svelte';

	export let data: ArtistsGrid;
</script>

<section class="artists-grid">
	{#each data.artists as artist (artist._id)}
		<ArtistThumb {artist} />
	{/each}
</section>

<style>
	@media (min-width: 720px) {
		section {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
		}
	}
</style>
