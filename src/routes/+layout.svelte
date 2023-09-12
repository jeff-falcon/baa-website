<script lang="ts">
	import TopNav from '$lib/ui/nav/TopNav.svelte';
	import 'video.js';
	import 'video.js/dist/video-js.css';
	import './styles.css';
	// import 'swiper/css';
	// import 'swiper/css/modules/navigation';
	import Footer from '$lib/ui/nav/Footer.svelte';
	import type { LayoutData } from './$types';
	import { isMenuOpenComplete } from '$lib/store';

	export let data: LayoutData;
</script>

<TopNav config={data.config} />

<main class:isDisabled={$isMenuOpenComplete}>
	<slot />
</main>

<Footer config={data.config} />

<svg viewBox="0 0 100 100" height="0" width="0">
	<defs>
		<filter id="colorizer-bg-light" color-interpolation-filters="sRGB">
			<feColorMatrix
				type="matrix"
				values="0 0 0 0 0.901960784313725  0 0 0 0 0.894117647058824  0 0 0 0 0.874509803921569  0 0 0 1 0"
			/>
		</filter>
		<filter id="colorizer-bg-dark" color-interpolation-filters="sRGB">
			<feColorMatrix
				type="matrix"
				values="0 0 0 0 0.149019607843137  0 0 0 0 0.149019607843137  0 0 0 0 0.149019607843137  0 0 0 1 0"
			/>
		</filter>
		<filter id="colorizer-text-light" color-interpolation-filters="sRGB">
			<feColorMatrix
				type="matrix"
				values="0 0 0 0 0.078431372549  0 0 0 0 0.996078431372549  0 0 0 0 0.996078431372549  0 0 0 1 0"
			/>
		</filter>
	</defs>
</svg>

<style>
	main {
		width: 100%;
	}
	main.isDisabled {
		visibility: hidden;
	}
	svg {
		display: block;
	}
</style>
