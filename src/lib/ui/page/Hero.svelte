<script lang="ts">
	import type { Hero, HeroArtist, Project, ProjectMedia } from '$lib/types';
	import ArrowButton from '$lib/ui/button/ArrowButton.svelte';
	import { onMount } from 'svelte';
	import ProjectMediaComponent from '../project/ProjectMediaComponent.svelte';
	import ArrowIcon from '../button/ArrowIcon.svelte';

	export let data: Hero;

	let scrollY = 0;
	let innerHeight = 0;

	let currentArtist: HeroArtist = data.artists[0];

	$: scrollPct = innerHeight ? Math.max(0, Math.min(1, scrollY / innerHeight)) : 0;
	$: canApplyTransform = Math.abs(scrollY) < innerHeight + 100;
	$: bgStyle = canApplyTransform ? `transform: translateY(${scrollY * 0.55}px);` : '';
	$: fgStyle = canApplyTransform
		? `transform: translateY(${scrollY * 0.65}px); opacity: ${1 - scrollPct};`
		: '';
	$: dimStyle = canApplyTransform ? `opacity: ${scrollPct * 0.7 + 0.3};` : '';

	function getMediaForArtist(artist: HeroArtist) {
		const media: ProjectMedia = {
			_key: 'hero',
			_type: 'project_media',
			name: '',
			kind: artist.kind,
			image: artist.image,
			videoBgSrc: artist.videoBgSrc,
			videoBgSrcHd: artist.videoBgSrcHd,
			useOriginalQuality: false,
			autoplay: true
		};
		return media;
	}
	onMount(() => {
		let index = 0;
		const myInt = window.setInterval(() => {
			index = (index + 1) % data.artists.length;
			currentArtist = data.artists[index];
		}, 4000);
		return () => {
			clearInterval(myInt);
		};
	});
</script>

<svelte:window bind:scrollY bind:innerHeight />
<section
	class="hero"
	data-scroll-pct={scrollPct}
	data-scroll-y={scrollY}
	data-inner-height={innerHeight}
>
	<div class="info gutter">
		<div class="wrap" style={fgStyle}>
			{#if data.name}
				<h1 class="title">{data.name}</h1>
			{/if}
			{#if data.subtitle}
				<p class="subtitle">{data.subtitle}</p>
			{/if}
			<div class="footer">
				<div class="artist-names">
					{#each data.artists as artist (artist.name)}
						<h4 class="artist-name" style="opacity: {currentArtist.name === artist.name ? 1 : 0}">
							{artist.name}
						</h4>
					{/each}
				</div>
				<div
					class="arrow"
					style="--text-color: var(--text-light); --text-color-40: var(--text-light-40)"
				>
					<ArrowIcon direction="down" />
				</div>
			</div>
		</div>
	</div>
	<div class="dim" style={dimStyle} />
	<div class="bg" style={bgStyle}>
		{#each data.artists as artist (artist.name)}
			<div class="artist-media" style="opacity: {currentArtist.name === artist.name ? 1 : 0}">
				{#key `artist_hero_media_${artist.name}`}
					<ProjectMediaComponent
						media={getMediaForArtist(artist)}
						cover={true}
						scaleOnReveal={false}
						fadeOnReveal={false}
						isFullWidth={true}
					/>
				{/key}
			</div>
		{/each}
	</div>
</section>

<style>
	section {
		position: relative;
		height: 100svh;
		overflow: hidden;
		color: var(--text-light);
	}
	.bg,
	.dim,
	.artist-media {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}
	.artist-media,
	.artist-name {
		opacity: 0;
		transition: opacity linear 1.2s;
	}
	.artist-name {
		transition-duration: 0.3s;
	}
	.bg {
		z-index: 0;
	}
	.dim {
		background: black;
		z-index: 1;
		opacity: 0.3;
	}
	.info {
		position: relative;
		z-index: 2;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		height: 100%;
		padding-bottom: var(--16pt);
	}
	.title {
		font-size: var(--38pt);
		line-height: var(--40pt);
		margin: 0;
	}
	.subtitle {
		font-size: var(--24pt);
		line-height: var(--32pt);
		margin: var(--16pt) 0 0;
	}
	.footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		color: inherit;
		border-top: 1px solid var(--text-light-40);
		padding-top: var(--16pt);
		margin-top: var(--24pt);
	}
	.artist-names {
		position: relative;
		height: var(--24pt);
		flex: 1;
		opacity: 0.4;
	}
	.artist-name {
		margin: 0;
		line-height: var(--24pt);
		text-transform: uppercase;
		font-size: var(--14pt);
		position: absolute;
		top: 0;
		left: 0;
		display: block;
	}
	.hero :global(+ section.text-only) {
		padding-top: 6rem;
	}
	.arrow {
		white-space: nowrap;
	}
	.title {
		text-transform: uppercase;
		font-weight: bold;
		font-size: var(--24pt);
		line-height: 1.24;
	}
	.subtitle {
		font-size: var(--16pt);
		line-height: 1.24;
	}
	@media (min-width: 720px) {
		.info {
			padding-bottom: 40px;
		}
		.wrap {
			display: grid;
			grid-template-columns: repeat(12, 1fr);
			gap: 0 var(--gutter-lg);
			align-items: start;
		}
		.title {
			grid-column: 1 / span 7;
			grid-row: 1;
			font-size: var(--48pt);
			line-height: 1.12;
		}
		.subtitle {
			grid-column: 9 / span 4;
			grid-row: 1;
			font-size: var(--20pt);
			margin: 0;
		}
		.hero :global(+ section.text-only) {
			padding-top: 8rem;
		}
		.footer {
			grid-column: 1 / span 12;
			grid-row: 2;
			padding-top: var(--20pt);
			margin-top: var(--32pt);
		}
	}
</style>
