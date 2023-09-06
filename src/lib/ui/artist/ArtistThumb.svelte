<script lang="ts">
	import type { Artist } from '$lib/types';
	import { onMount } from 'svelte';
	import ArrowIcon from '../button/ArrowIcon.svelte';
	import ProjectMediaComponent from '../project/ProjectMediaComponent.svelte';

	export let artist: Artist;
	let currentKey: string = artist.featured?.[0]?._key ?? '';
	let opacities: number[] = initOpacities();

	function initOpacities() {
		return artist.featured?.map((item, index) => (index === 0 ? 1 : 0)) ?? [];
	}

	onMount(() => {
		if (artist.featured) {
			let index = 0;
			const myInt = window.setInterval(() => {
				index = (index + 1) % artist.featured!.length;
				if (index === 0) {
					opacities = initOpacities();
				} else {
					opacities[index] = 1;
				}
			}, 4000);
			return () => {
				clearInterval(myInt);
			};
		}
	});
</script>

<div class="artist">
	<a href={`/artists/${artist.slug}/`} class="link">
		<div class="images">
			{#if artist.featured && Array.isArray(artist.featured) && artist.featured.length > 0}
				{#each artist.featured as feature, index (feature)}
					<div class="image" style="opacity: {opacities[index]}">
						<ProjectMediaComponent
							media={feature}
							fadeOnReveal={false}
							scaleOnReveal={false}
							cover={true}
						/>
					</div>
				{/each}
			{/if}
		</div>
		<div class="dim" />
		<div class="info gutter">
			<div class="wrap">
				<div class="name-skill">
					<h3 class="name">{artist.name}</h3>
					<p class="skills">{artist.tags ? artist.tags.join(', ') : 'Unknown skills'}</p>
				</div>
				<ArrowIcon direction="right" />
			</div>
		</div>
	</a>
</div>

<style>
	.artist {
		padding-top: 132.23%;
		position: relative;
	}
	.link,
	.images,
	.dim,
	.image {
		display: block;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}
	.images {
		z-index: 0;
	}
	.image {
		transition: opacity linear 0.5s;
	}
	.dim {
		z-index: 1;
		background: black;
		opacity: 0.3;
	}
	.info {
		z-index: 2;
		position: absolute;
		bottom: var(--24pt);
		width: 100%;
		left: 0;
		color: var(--text-light);
		--text-color: var(--text-light);
		--text-color-40: var(--text-light-40);
	}
	.info .wrap {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		border-top: 1px solid var(--text-light-40);
		padding-top: var(--20pt);
	}
	a:hover {
		text-decoration: none;
	}
	.info .name,
	.info .skills {
		margin: 0;
		line-height: var(--24pt);
	}
	.info .name {
		font-size: var(--20pt);
	}
	.info .skills {
		font-size: var(--16pt);
		opacity: 0.6;
	}
	@media (min-width: 720px) {
		.artist {
			padding-top: 99.67%;
		}
	}
</style>
