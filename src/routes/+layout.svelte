<script lang="ts">
	import TopNav from '$lib/ui/nav/TopNav.svelte';
	import 'video.js';
	import 'video.js/dist/video-js.css';
	import './styles.css';
	import Footer from '$lib/ui/nav/Footer.svelte';
	import type { LayoutData } from './$types';
	import { isMenuOpenComplete, artistContactInfo } from '$lib/store';
	import { PUBLIC_GA4_TAG_ID } from '$env/static/public';

	export let data: LayoutData;

	artistContactInfo.set(data.config.artistContactInfo);
</script>

<svelte:head>
	<script async src="https://www.googletagmanager.com/gtag/js?id={PUBLIC_GA4_TAG_ID}"></script>
	<script data-tag-id={PUBLIC_GA4_TAG_ID}>
		window.dataLayer = window.dataLayer || [];
		function gtag() {
			dataLayer.push(arguments);
		}
		gtag('js', new Date());

		gtag('config', document.querySelector('script[data-tag-id]').dataset.tagId);
	</script>
</svelte:head>

<TopNav config={data.config} />
<div class="site-wrap">
	<main class:isDisabled={$isMenuOpenComplete}>
		<slot />
	</main>

	<Footer config={data.config} />
</div>

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
		flex: 1;
	}
	main.isDisabled {
		pointer-events: none;
	}
	svg {
		display: block;
	}
	.site-wrap {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}
</style>
