<script lang="ts">
	import IntersectionObserver from 'svelte-intersection-observer';
	import { onMount, createEventDispatcher } from 'svelte';
	import videojs from 'video.js';

	const dispatch = createEventDispatcher<{ isPlaying: boolean }>();

	export let src: string;
	export let placeholder: string = '';
	export let id: string;
	export let title: string | null = null;
	export let autoplay = false;

	type Player = ReturnType<typeof videojs>;

	let containerEl: HTMLElement;
	let videoEl: HTMLVideoElement | null = null;
	let isIntersecting = false;
	let shouldReveal = false;
	let startedPlaying = false;
	let vjsPlayer: Player | null = null;
	let wasPlaying = false;
	let shouldAutoPlay = false;

	function onPlaying() {
		dispatch('isPlaying', true);
		startedPlaying = true;
		wasPlaying = true;
	}
	function onPaused() {
		dispatch('isPlaying', false);
	}

	$: if (isIntersecting && !shouldReveal) {
		shouldReveal = true;
	}

	$: if ((isIntersecting || !isIntersecting) && startedPlaying) {
		if (isIntersecting && wasPlaying) {
			vjsPlayer?.play();
		} else if (!isIntersecting) {
			wasPlaying = vjsPlayer?.paused() === false ?? false;
			vjsPlayer?.pause();
		}
	}

	onMount(() => {
		shouldAutoPlay = window.innerWidth < 560 ? true : autoplay;

		const player = videojs(videoEl!, {
			preferFullWindow: true,
			controlBar: {
				volumePanel: {
					inline: false
				}
			},
			html5: {
				vhs: {
					limitRenditionByPlayerDimensions: false,
					useDevicePixelRatio: true,
					bandwidth: 1000000000
				}
			},
			autoplay: shouldAutoPlay
		});
		player.debug(true);
		player.on('playing', onPlaying);
		player.on('pause', onPaused);
		player.on('volumechange', () => {
			localStorage.setItem('video-volume', player.volume().toString());
		});
		player.volume(Number(localStorage.getItem('video-volume') ?? 1));
		vjsPlayer = player;

		return () => {
			vjsPlayer = null;
			player.off('playing', onPlaying);
			player.off('pause', onPaused);
			player.dispose();
		};
	});
</script>

<IntersectionObserver element={containerEl} bind:intersecting={isIntersecting}>
	<div class="video-container" bind:this={containerEl} class:shouldReveal>
		<!-- svelte-ignore a11y-media-has-caption -->
		<video
			{id}
			class="video-js vjs-fill vjs-16-9"
			bind:this={videoEl}
			loop
			controls
			preload="auto"
			muted={shouldAutoPlay || undefined}
			poster={placeholder || undefined}
		>
			<source {src} />
		</video>
	</div>
</IntersectionObserver>

<style>
	.video-container {
		opacity: 0;
		transition: opacity 1200ms linear;
	}
	.shouldReveal.video-container {
		opacity: 1;
	}
	.video-container :global(.vjs-big-play-button) {
		border: 0;
		border-radius: 0;
		font-size: 8em;
		width: 100%;
		height: 100%;
		left: 0;
		top: 0;
		transform: translateZ(0);
		margin: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.video-container :global(.vjs-big-play-button),
	.video-container :global(.video-js:hover .vjs-big-play-button),
	.video-container :global(.vjs-big-play-button:focus) {
		background-color: rgba(0, 0, 0, 0.2);
	}
	.video-container :global(.vjs-big-play-button .vjs-icon-placeholder:before) {
		transform: scale(0.8, 1);
		height: 100px;
		width: 100px;
		position: relative;
		top: auto;
		left: auto;
	}
	.video-container :global(.vjs-controls-disabled .vjs-big-play-button),
	.video-container :global(.vjs-has-started .vjs-big-play-button),
	.video-container :global(.vjs-using-native-controls .vjs-big-play-button),
	.video-container :global(.vjs-error .vjs-big-play-button) {
		display: none;
	}
	.video-container :global(.vjs-control-bar) {
		--progress-bar-height: 30px;
		--bar-height: calc(var(--progress-bar-height) + 32px);
		height: var(--bar-height);
		background: transparent;
		margin: 0 16px 16px;
		width: auto;
	}
	.video-container :global(.vjs-control-bar .vjs-progress-holder) {
		margin: 0;
		height: var(--progress-bar-height);
		background-color: rgba(255, 255, 255, 0.2);
	}
	.video-container :global(.vjs-play-progress:before) {
		display: none;
	}
	.video-container :global(.vjs-load-progress) {
		background-color: rgba(255, 255, 255, 0.1);
	}
	.video-container :global(.vjs-load-progress div) {
		background-color: rgba(255, 255, 255, 0.15);
	}
	.video-container :global(.vjs-play-control) {
		width: 22px;
		order: 1;
		padding-left: 16px;
		padding-right: 16px;
		box-sizing: content-box;
	}
	.video-container :global(.vjs-volume-panel) {
		order: 3;
		margin-left: 12px;
	}
	.video-container :global(.vjs-volume-panel.vjs-volume-panel-vertical) {
		width: 40px;
		transition: 300ms var(--ease-in-out-cubic);
		transition-property: width, background-color;
	}
	.video-container :global(.vjs-volume-panel.vjs-volume-panel-vertical.vjs-hover) {
		background-color: rgba(0, 0, 0, 0.2);
	}
	.video-container :global(.vjs-mute-control .vjs-icon-placeholder:before) {
		font-size: 32px;
		line-height: var(--bar-height);
	}
	.video-container :global(.vjs-progress-control) {
		order: 2;
	}
	.video-container :global(.vjs-play-control .vjs-icon-placeholder:before) {
		font-size: 46px;
		line-height: var(--bar-height);
		left: -3px;
	}
	.video-container :global(.vjs-icon-pause:before),
	.video-container :global(.vjs-play-control.vjs-playing .vjs-icon-placeholder:before) {
		left: 0;
	}
	.video-container :global(.vjs-fullscreen-control) {
		margin-left: 16px;
		margin-right: 16px;
		width: 34px;
		order: 4;
	}
	.video-container :global(.vjs-fullscreen-control .vjs-icon-placeholder:before) {
		background: url('data:image/svg+xml,<svg width="34" height="30" viewBox="0 0 34 30" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M0 0H10.5V3H3V9.5H0V0Z" fill="white"/><path fill-rule="evenodd" clip-rule="evenodd" d="M34 0H23.5V3H31V9.5H34V0Z" fill="white"/><path fill-rule="evenodd" clip-rule="evenodd" d="M0 30H10.5V27H3V20.5H0V30Z" fill="white"/><path fill-rule="evenodd" clip-rule="evenodd" d="M34 30H23.5V27H31V20.5H34V30Z" fill="white"/></svg>');
		content: '';
		width: 34px;
		height: 30px;
		top: 16px;
	}
	.video-container :global(.vjs-fullscreen .vjs-fullscreen-control .vjs-icon-placeholder:before) {
		background: url('data:image/svg+xml,<svg width="34" height="30" viewBox="0 0 34 30" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M10.5 9.5L0 9.5L2.62268e-07 6.5L7.5 6.5L7.5 -2.62268e-07L10.5 0L10.5 9.5Z" fill="white"/><path fill-rule="evenodd" clip-rule="evenodd" d="M23.5 9.5L34 9.5L34 6.5L26.5 6.5L26.5 5.24537e-07L23.5 0L23.5 9.5Z" fill="white"/><path fill-rule="evenodd" clip-rule="evenodd" d="M10.5 20.5L0 20.5L-2.62268e-07 23.5L7.5 23.5L7.5 30L10.5 30L10.5 20.5Z" fill="white"/><path fill-rule="evenodd" clip-rule="evenodd" d="M23.5 20.5L34 20.5L34 23.5L26.5 23.5L26.5 30L23.5 30L23.5 20.5Z" fill="white"/></svg>');
		content: '';
	}
	.video-container :global(.vjs-picture-in-picture-control),
	.video-container :global(.vjs-remaining-time),
	.video-container :global(.vjs-subs-caps-button) {
		display: none;
	}
	.video-container :global(.vjs-progress-control:hover .vjs-time-tooltip),
	.video-container :global(.vjs-progress-control:focus .vjs-time-tooltip),
	.video-container :global(.vjs-time-tooltip),
	.video-container :global(.vjs-volume-tooltip) {
		font-family: monospace;
		font-size: 12px;
		padding: 6px 8px;
	}
	.video-container :global(.vjs-volume-bar.vjs-slider-vertical) {
		background: url('data:image/svg+xml,<svg width="18" height="52" viewBox="0 0 18 52" fill="none" xmlns="http://www.w3.org/2000/svg"><g fill="white" opacity="0.25"><rect width="18" height="3"/><rect y="7" width="18" height="3"/><rect y="14" width="18" height="3"/><rect y="21" width="18" height="3"/><rect y="28" width="18" height="3"/><rect y="35" width="18" height="3"/><rect y="42" width="18" height="3"/><rect y="49" width="18" height="3"/></g></svg>')
			top center;
		background-size: 18px 52px;
		width: 18px;
		height: 52px;
		margin: 0 auto;
	}
	.video-container :global(.vjs-volume-control.vjs-volume-vertical) {
		background-color: transparent;
		width: 40px;
		height: calc(var(--bar-height) + 6px);
		padding: 8px 0;
		margin: 0;
		bottom: calc(var(--bar-height) + 6px);
		transition: opacity 300ms var(--ease-in-out-cubic);
	}

	.video-container :global(.vjs-volume-panel.vjs-hover .vjs-volume-control.vjs-volume-vertical) {
		background-color: rgba(0, 0, 0, 0.2);
		left: -40px;
		transition: opacity 300ms var(--ease-in-out-cubic);
	}
	.video-container :global(.vjs-volume-bar.vjs-slider-vertical .vjs-volume-level) {
		background: url('data:image/svg+xml,<svg width="18" height="52" viewBox="0 0 18 52" fill="none" xmlns="http://www.w3.org/2000/svg"><g fill="white"><rect width="18" height="3"/><rect y="7" width="18" height="3"/><rect y="14" width="18" height="3"/><rect y="21" width="18" height="3"/><rect y="28" width="18" height="3"/><rect y="35" width="18" height="3"/><rect y="42" width="18" height="3"/><rect y="49" width="18" height="3"/></g></svg>')
			bottom center;
		background-size: 18px 52px;
		width: 18px;
	}
	.video-container :global(.vjs-volume-bar.vjs-slider-vertical .vjs-volume-level:before) {
		display: none;
	}
	.video-container :global(.vjs-poster img) {
		opacity: 0.6;
	}
</style>
