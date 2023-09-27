<script lang="ts">
	import type { ProjectMedia } from '$lib/types';
	import VimeoBG from '$lib/ui/video/VimeoBG_VJS.svelte';
	import IntersectionObserver from 'svelte-intersection-observer';
	import VimeoPlayer from '../video/VimeoPlayer.svelte';
	import { cubicOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';

	export let media: ProjectMedia;
	export let cover: 'desktop' | boolean = false;
	export let fillContainer = false;
	export let scaleOnReveal = true;
	export let fadeOnReveal = true;
	export let isFullWidth = true;
	export let title = '';
	export let subtitle = '';
	export let preTitle = '';
	export let isTitleVisible = true;
	export let isInsidePair = false;
	export let hasEmptyTitle = false;
	export let aspectRatio = 0;

	let figureEl: HTMLElement;
	let isIntersecting = false;
	let isVideoPlaying = false;
	$: videoBgSrc = (isFullWidth ? media.videoBgSrcHd || media.videoBgSrc : media.videoBgSrc) || '';
	$: isBgVideo = media.kind === 'video-bg' && Boolean(videoBgSrc);
	$: isStaticImage = media.kind === 'image' && Boolean(media.image?.url);
	$: isVideoPlayer = media.kind === 'video-player' && Boolean(media.videoPlayerSrc);

	function onVideoPlaying(e: { detail: boolean }) {
		window.requestAnimationFrame(() => {
			isVideoPlaying = e.detail;
		});
	}
</script>

{#if isVideoPlayer}
	{@const src = media.videoPlayerSrc ?? ''}
	<div
		class="video-player"
		class:isInsidePair
		class:fillPlayer={isInsidePair && media.fillContainer}
		style={aspectRatio && isInsidePair && media.fillContainer
			? `--pad-top: ${aspectRatio * 100}%`
			: ''}
	>
		{#if title}
			<div class="title-wrap gutter" style="opacity: {isTitleVisible ? 1 : 0}">
				{#if preTitle}
					<h2
						class="pre-title"
						in:fly|global={{ y: 0, opacity: 0, easing: cubicOut, duration: 750, delay: 100 }}
					>
						{preTitle}
					</h2>
				{/if}
				<h1
					class="title"
					in:fly|global={{ y: 0, opacity: 0, duration: 750, delay: 150, easing: cubicOut }}
				>
					{title}
				</h1>
				{#if subtitle}
					<h3
						class="subtitle"
						in:fly|global={{ y: 0, opacity: 0, easing: cubicOut, duration: 750, delay: 200 }}
					>
						{subtitle}
					</h3>
				{/if}
			</div>
		{/if}
		<VimeoPlayer
			id="media-{media._key}"
			{src}
			title={media.name}
			placeholder={media.image?.url || undefined}
			autoplay={media.autoplay}
		/>
	</div>
{:else if isStaticImage || isBgVideo}
	<IntersectionObserver element={figureEl} bind:intersecting={isIntersecting} once={true}>
		<figure
			class="media"
			class:isBgVideo
			class:isVideoPlaying
			class:isFullWidth
			bind:this={figureEl}
			class:isIntersecting
			class:scaleOnReveal
			class:fadeOnReveal
			class:fillContainer={cover === false && fillContainer}
			class:desktopCover={cover === 'desktop' && !fillContainer}
			class:mobileCover={cover === true && !fillContainer}
			data-is-video-playing={isVideoPlaying}
			class:isInsidePair
			class:hasEmptyTitle
		>
			{#if title}
				<div
					class="title-wrap gutter"
					style="opacity: {isTitleVisible ? 1 : 0}"
					class:hasPreTitle={Boolean(preTitle)}
				>
					{#if preTitle}
						<h2
							class="pre-title"
							in:fly|global={{ y: 0, opacity: 0, easing: cubicOut, duration: 750, delay: 100 }}
						>
							{preTitle}
						</h2>
					{/if}
					<h1
						class="title"
						in:fly|global={{ y: 0, opacity: 0, duration: 750, delay: 150, easing: cubicOut }}
					>
						{title}
					</h1>
					{#if subtitle}
						<h3
							class="subtitle"
							in:fly|global={{ y: 0, opacity: 0, easing: cubicOut, duration: 750, delay: 200 }}
						>
							{subtitle}
						</h3>
					{/if}
				</div>
			{/if}
			{#if isBgVideo}
				<VimeoBG
					id="media-{media._key}"
					src={videoBgSrc || ''}
					placeholder={media.image?.url ?? ''}
					bind:isIntersecting
					on:isPlaying={onVideoPlaying}
				/>
			{/if}
			{#if media.image}
				{#if media.image.sizes}
					<picture class="pic">
						<source srcset={media.image.sizes.sm} media="(max-width: 719px)" />
						<source
							srcset={media.image.sizes.md}
							media="(min-width: 720px) and (max-width: 1199px)"
						/>
						<source srcset={media.image.sizes.lg} media="(min-width: 1200px)" />
						<img
							class="img"
							src={media.image.sizes.sm}
							width={media.image.width}
							height={media.image.height}
							alt={media.name}
						/>
					</picture>
				{:else}
					<img
						class="img"
						src={media.image.url}
						width={media.image.width}
						height={media.image.height}
						alt={media.name}
					/>
				{/if}
			{/if}
		</figure>
	</IntersectionObserver>
{/if}

<style>
	.media {
		padding: 0;
		margin: 0;
		position: relative;
	}
	.media img {
		display: block;
		object-fit: contain;
		width: 100%;
		position: relative;
		z-index: 0;
		height: auto;
	}
	.video-player .title,
	.media .title {
		margin: 0;
		line-height: 1;
	}
	.video-player .subtitle,
	.media .subtitle {
		margin: 0;
	}
	.fillPlayer.video-player :global(.video-js.vjs-16-9:not(.vjs-audio-only-mode)) {
		padding-top: var(--pad-top);
	}
	.title-wrap {
		margin-bottom: var(--24pt);
		transition: opacity linear 300ms;
	}
	.video-player .title-wrap {
		position: -webkit-sticky;
		position: sticky;
		top: var(--site-top-padding);
		padding-top: 24px;
		z-index: -1;
	}
	.media .title-wrap {
		width: 100%;
		margin-bottom: 0;
		padding-bottom: var(--24pt);
		padding-top: 40px;
		background: linear-gradient(to bottom, hsla(0, 0%, 15%, 0) 0%, hsla(0, 0%, 15%, 0.6) 100%);
		position: absolute;
		bottom: 0;
		z-index: 2;
		--text-color: var(--text-light);
		--text-color-40: var(--text-light-40);
		color: var(--text-color);
	}
	.title-wrap .pre-title {
		border-top: 1px solid var(--text-color-40);
		padding-top: var(--24pt);
		line-height: 1.12;
		text-transform: uppercase;
		font-size: var(--18pt);
		font-weight: bold;
		margin: 0 0 10px;
	}
	.subtitle {
		padding-top: var(--8pt);
		font-size: var(--14pt);
		line-height: var(--16pt);
	}
	picture {
		position: relative;
		overflow: hidden;
		display: block;
	}
	.media :global(.video-container) {
		z-index: 1;
	}
	.mobileCover.media,
	.mobileCover img,
	.mobileCover picture,
	.fillContainer img,
	.fillContainer picture {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: block;
	}
	.fillContainer {
		position: relative;
	}
	.mobileCover img,
	.fillContainer img {
		object-fit: cover;
	}
	.mobileCover.isBgVideo.isVideoPlaying picture {
		visibility: hidden;
	}
	.mobileCover.isBgVideo :global(.video-container) {
		opacity: 0;
		transition: 1200ms linear opacity;
	}
	.mobileCover.isBgVideo.isVideoPlaying :global(.video-container) {
		opacity: 1;
	}
	.media:not(.isBgVideo) picture {
		overflow: hidden;
	}
	.media.scaleOnReveal:not(.isBgVideo):not(.isIntersecting) img {
		transform: scale(1.15);
	}
	.media:not(.isBgVideo) img {
		transform-origin: center top;
		transition: 1.5s linear opacity, 5s transform var(--ease-out-cubic);
	}
	.media.fadeOnReveal:not(.isBgVideo) img {
		opacity: 0;
	}
	.media:not(.isBgVideo).isIntersecting.fadeOnReveal img {
		opacity: 1;
	}
	.media.scaleOnReveal:not(.isBgVideo).isIntersecting img {
		transform: scale(1);
	}
	@media (min-width: 560px) {
		.video-player .title-wrap .title {
			width: 80%;
		}
	}
	@media (min-width: 720px) {
		/* .fillPlayer.video-player :global(.video-container) {
			height: 100%;
		} */
		.title-wrap .title {
			font-size: 4.25rem;
			line-height: 1;
		}
		.video-player .title-wrap {
			padding-top: 80px;
			margin-bottom: 40px;
		}
		.desktopCover.media,
		.desktopCover img,
		.desktopCover picture {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			display: block;
		}
		.desktopCover img {
			object-fit: cover;
		}
		.desktopCover.isBgVideo.isVideoPlaying picture {
			visibility: hidden;
		}
		.desktopCover.isBgVideo :global(.video-container) {
			opacity: 0;
			transition: 1200ms linear opacity;
		}
		.desktopCover.isBgVideo.isVideoPlaying :global(.video-container) {
			opacity: 1;
		}
	}
	@media (min-width: 1280px) {
		.video-player .title-wrap .title {
			width: 67%;
			max-width: 920px;
		}
		.isInsidePair .title-wrap * {
			width: 80%;
			max-width: 100%;
		}
		.title-wrap .title {
			font-size: 4.75rem;
		}
		.isInsidePair.hasEmptyTitle .title-wrap * {
			opacity: 0;
		}
	}
</style>
