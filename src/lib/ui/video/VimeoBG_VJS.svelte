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

	$: hasRedirect = src.includes('progressive_redirect');

	$: if (isIntersecting || !isIntersecting) {
		clearTimeout(playerTimeout);
		if (isIntersecting && isReady && !isPlaying) {
			videoEl?.play();
		} else if (!isIntersecting && isPlaying) {
			playerTimeout = setTimeout(() => {
				videoEl?.pause();
			}, 50);
		}
	}

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
	}

	async function getRedirect() {
		const res = await fetch(src, { method: 'HEAD' });
		if (videoEl && res.url) {
			videoEl.src = res.url;
		}
	}

	onMount(() => {
		if (videoEl) {
			videoEl.addEventListener('playing', onPlaying);
			videoEl.addEventListener('pause', onPaused);
			videoEl.addEventListener('canplay', onReady);
			if (hasRedirect) {
				getRedirect();
			} else {
				videoEl.src = src;
			}
		}
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
