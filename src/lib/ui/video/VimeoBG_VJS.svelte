<script lang="ts">
	import { onMount, createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher<{ isPlaying: boolean }>();

	export let src: string;
	export let placeholder: string = '';
	export let id: string;
	export let isIntersecting = false;

	let isPlaying = false;
	let isReady = false;
	let playerTimeout: number | NodeJS.Timeout = 0;

	let videoEl: HTMLVideoElement | null = null;

	$: if (isIntersecting || !isIntersecting) {
		clearTimeout(playerTimeout);
		if (isIntersecting && isReady && !isPlaying) {
			videoEl?.play();
			console.log('isIntersecting', isIntersecting);
		} else if (!isIntersecting && isPlaying) {
			playerTimeout = setTimeout(() => {
				console.log('isIntersecting', isIntersecting);
				videoEl?.pause();
			}, 50);
		}
	}

	function onPlaying() {
		console.log('video is now playing');
		dispatch('isPlaying', true);
		isPlaying = true;
	}
	function onPaused() {
		dispatch('isPlaying', false);
		isPlaying = false;
	}

	function onReady() {
		isReady = true;
		console.log('isReady', src);
	}

	onMount(() => {
		videoEl?.addEventListener('playing', onPlaying);
		videoEl?.addEventListener('pause', onPaused);
		videoEl?.addEventListener('canplay', onReady);
		videoEl!.src = src;
		return () => {
			videoEl?.removeEventListener('playing', onPlaying);
			videoEl?.removeEventListener('pause', onPaused);
			videoEl?.removeEventListener('canplay', onReady);
		};
	});
</script>

<div class="video-container" class:isPlaying class:isIntersecting>
	<video
		{id}
		bind:this={videoEl}
		playsinline
		loop
		muted
		autoplay
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
