<script lang="ts">
	import { onMount, createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher<{
		isPlaying: boolean;
		start: void;
		end: void;
		ready: { duration: number };
	}>();

	export let src: string;
	export let placeholder: string = '';
	export let id: string;

	let isPlaying = false;
	let isReady = false;
	let playerTimeout: number | NodeJS.Timeout = 0;

	let videoEl: HTMLVideoElement | null = null;

	function onPlaying() {
		dispatch('isPlaying', true);
		isPlaying = true;
	}
	function onPaused() {
		dispatch('isPlaying', false);
		isPlaying = false;
	}

	function onReady() {
		isReady = true;
		dispatch('ready', { duration: videoEl!.duration });
		console.log('ready');
	}

	function onEnd() {
		dispatch('end');
		console.log('end');
	}

	export function startPlaying() {
		if ((videoEl?.currentTime ?? 0) > 0) {
			videoEl!.currentTime = 0;
		}
		videoEl?.play();
		dispatch('start');
	}

	onMount(() => {
		videoEl?.addEventListener('playing', onPlaying);
		videoEl?.addEventListener('pause', onPaused);
		videoEl?.addEventListener('canplay', onReady);
		videoEl?.addEventListener('ended', onEnd);
		videoEl!.src = src;
		return () => {
			videoEl?.removeEventListener('playing', onPlaying);
			videoEl?.removeEventListener('pause', onPaused);
			videoEl?.removeEventListener('canplay', onReady);
			videoEl?.removeEventListener('ended', onEnd);
		};
	});
</script>

<div class="video-container" class:isPlaying>
	<video
		{id}
		bind:this={videoEl}
		playsinline
		muted
		poster={placeholder}
		crossorigin="anonymous"
		disablepictureinpicture
		disableremoteplayback
	/>
</div>

<style>
	.video-container,
	.video-container :global(video) {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
	}
	.video-container :global(video) {
		object-fit: cover;
	}
	.isPlaying :global(.vjs-poster) {
		opacity: 0;
	}
</style>
