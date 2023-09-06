<script lang="ts">
	import type { ProjectMedia } from '$lib/types';
	import VimeoBG from '$lib/ui/video/VimeoBG_VJS.svelte';
	import IntersectionObserver from 'svelte-intersection-observer';
	import VimeoPlayer from '../video/VimeoPlayer.svelte';
	import VimeoEmbed from '../video/VimeoEmbed.svelte';

	export let media: ProjectMedia;
	export let cover = false;
	export let fillContainer = false;
	export let scaleOnReveal = true;
	export let fadeOnReveal = true;
	export let isFullWidth = true;

	console.log(media);

	let figureEl: HTMLElement;
	let isIntersecting = false;
	let isVideoPlaying = false;
	$: videoBgSrc = (isFullWidth ? media.videoBgSrcHd || media.videoBgSrc : media.videoBgSrc) || '';
	$: isBgVideo = media.kind === 'video-bg' && Boolean(videoBgSrc);
	$: isStaticImage = media.kind === 'image' && Boolean(media.image?.url);
	$: hasVideoId = !isNaN(Number(videoBgSrc));
	$: isVideoPlayer = media.kind === 'video-player' && Boolean(media.videoPlayerSrc) && !hasVideoId;
	$: isVideoEmbed = isBgVideo && hasVideoId;

	function onVideoPlaying(e: { detail: boolean }) {
		window.requestAnimationFrame(() => {
			isVideoPlaying = e.detail;
		});
	}
</script>

{#if isVideoPlayer}
	{@const src = media.videoPlayerSrc ?? ''}
	<div class="video-player">
		<VimeoPlayer
			id="media-{media._key}"
			{src}
			title={media.name}
			placeholder={media.image?.url || undefined}
			autoplay={media.autoplay}
		/>
	</div>
{:else if isStaticImage || isBgVideo || isVideoEmbed}
	<IntersectionObserver element={figureEl} bind:intersecting={isIntersecting} once={true}>
		<figure
			class="media"
			class:cover={cover && !fillContainer}
			class:isBgVideo
			class:isVideoPlaying
			class:isFullWidth
			bind:this={figureEl}
			class:isIntersecting
			class:scaleOnReveal
			class:fadeOnReveal
			class:fillContainer={!cover && fillContainer}
			data-is-video-playing={isVideoPlaying}
			data-has-video-id={hasVideoId}
			data-is-video-embed={isVideoEmbed}
		>
			{#if isVideoEmbed}
				<VimeoEmbed vimeoId={Number(videoBgSrc)} title={media.name} />
			{:else if isBgVideo}
				<VimeoBG
					id="media-{media._key}"
					src={videoBgSrc || ''}
					placeholder={media.image?.url ?? ''}
					bind:isIntersecting
					on:isPlaying={onVideoPlaying}
				/>
			{/if}
			{#if !isVideoEmbed && media.image}
				{#if media.image.sizes}
					<picture>
						<source srcset={media.image.sizes.sm} media="(max-width: 719px)" />
						<source
							srcset={media.image.sizes.md}
							media="(min-width: 720px) and (max-width: 1199px)"
						/>
						<source srcset={media.image.sizes.lg} media="(min-width: 1200px)" />
						<img
							src={media.image.sizes.sm}
							width={media.image.width}
							height={media.image.height}
							alt={media.name}
						/>
					</picture>
				{:else}
					<img
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
	}
	.media img {
		display: block;
		object-fit: contain;
		width: 100%;
		position: relative;
		z-index: 0;
		height: auto;
	}
	picture {
		position: relative;
		overflow: hidden;
		display: block;
	}
	.media :global(.video-container) {
		z-index: 1;
	}
	.cover.media,
	.cover img,
	.cover picture,
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
	.cover img,
	.fillContainer img {
		object-fit: cover;
	}
	.cover.isBgVideo.isVideoPlaying picture {
		visibility: hidden;
	}
	.cover.isBgVideo :global(.video-container) {
		opacity: 0;
		transition: 1200ms linear opacity;
	}
	.cover.isBgVideo.isVideoPlaying :global(.video-container) {
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
</style>
