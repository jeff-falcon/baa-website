<script lang="ts">
	import type { LogoGrid } from '$lib/types';

	export let data: LogoGrid;

	$: colors = data.color.split('/');
	$: bgColor = colors[0] ? `var(--${colors[0]})` : 'transparent';
	$: iconColor = `url(#colorizer-${colors[1] || 'white'})`;
	$: textColor = colors[0] ? `var(--${colors[1]})` : 'white';
	$: mobileMaxWidth = data.mobileMaxWidth ? `${data.mobileMaxWidth}px` : '100%';
	$: desktopMaxWidth = data.desktopMaxWidth ? `${data.desktopMaxWidth}px` : '100%';
</script>

<section
	class="logo-grid gutter"
	style="--bg-color: {bgColor}; --text-color: {textColor}; --mobile-max-width: {mobileMaxWidth}; --desktop-max-width: {desktopMaxWidth};"
>
	{#if data.title}
		<h2 class="title">{data.title}</h2>
	{/if}
	<picture>
		<source srcset={data.mobile} media="(max-width: 719px)" />
		<source srcset={data.desktop} media="(min-width: 720px)" />
		<img style="filter: {iconColor}" src={data.mobile} alt={data.title} />
	</picture>
</section>

<style>
	section {
		background-color: var(--bg-color);
		color: var(--text-color);
		padding-top: 96px;
		padding-bottom: 96px;
	}
	.title {
		margin: 0 0 48px;
		padding-bottom: 16px;
		border-bottom: 1px solid var(--text-light-15);
	}
	picture {
		margin-top: 48px;
		display: block;
	}
	img {
		margin-left: auto;
		margin-right: auto;
		display: block;
		width: 100%;
		height: auto;
		max-width: var(--mobile-max-width);
	}
	@media (min-width: 720px) {
		section {
			padding-top: 128px;
			padding-bottom: 128px;
		}
		picture {
			margin: 64px 0 0;
		}
		.title {
			padding-right: 0;
			padding-bottom: 48px;
			margin-bottom: 64px;
		}
		img {
			max-width: var(--desktop-max-width);
		}
	}
</style>
