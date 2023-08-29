<script lang="ts">
	import type { Hero, Project, ProjectMedia } from '$lib/types';
	import ArrowButton from '$lib/ui/button/ArrowButton.svelte';
	import ProjectMediaComponent from '../project/ProjectMediaComponent.svelte';

	export let data: Hero;

	let scrollY = 0;
	let innerHeight = 0;

	let media: ProjectMedia;
	$: media = {
		_key: 'hero',
		_type: 'project_media',
		name: '',
		kind: data.kind,
		image: data.image_desktop,
		videoBgSrc: data.videoBgSrc,
		videoBgSrcHd: data.videoBgSrcHd,
		useOriginalQuality: false,
		autoplay: true
	};
	$: scrollPct = innerHeight ? Math.max(0, Math.min(1, scrollY / innerHeight)) : 0;
	$: canApplyTransform = Math.abs(scrollY) < innerHeight + 100;
	$: bgStyle = canApplyTransform ? `transform: translateY(${scrollY * 0.55}px);` : '';
	$: fgStyle = canApplyTransform
		? `transform: translateY(${scrollY * 0.65}px); opacity: ${1 - scrollPct};`
		: '';
	$: dimStyle = canApplyTransform ? `opacity: ${scrollPct * 0.7 + 0.3};` : '';
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
			{#if data.project}
				<a href="/work/{data.project.slug}/" class="project">
					<div class="name-client">
						<h4 class="name">{data.project.shortName}</h4>
						<p class="client">{data.project.client}</p>
					</div>
					<div class="arrow">
						<ArrowButton title="View Project" isTitleHiddenOnMobile={true} isOverSolid={false} />
					</div>
				</a>
			{/if}
		</div>
	</div>
	<div class="dim" style={dimStyle} />
	<div class="bg" style={bgStyle}>
		{#key media._key}
			<ProjectMediaComponent {media} cover={true} scaleOnReveal={false} isFullWidth={true} />
		{/key}
	</div>
</section>

<style>
	section {
		position: relative;
		height: 100svh;
		overflow: hidden;
	}
	.bg,
	.dim {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
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
	.project {
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-top: 1px solid var(--text-light-30);
		padding-top: var(--12pt);
		margin-top: var(--18pt);
		gap: 16px;
	}
	.project:hover {
		text-decoration: none;
	}
	.name-client .name,
	.name-client .client {
		margin: 0;
		line-height: var(--24pt);
	}
	.name-client .name {
		text-transform: uppercase;
		font-weight: bold;
		font-size: var(--16pt);
	}
	.name-client .client {
		font-size: var(--14pt);
	}
	.hero :global(+ section.text-only) {
		padding-top: 6rem;
	}
	.arrow {
		white-space: nowrap;
	}
	@media (min-width: 720px) {
		.info {
			display: grid;
			grid-template-columns: repeat(4, 1fr);
			gap: var(--gutter-lg);
			align-items: end;
			padding-bottom: 72px;
		}
		.wrap {
			grid-column: 2 / span 3;
		}
		.hero :global(+ section.text-only) {
			padding-top: 8rem;
		}
	}
	@media (min-width: 1024px) {
		.wrap {
			grid-column: 3 / span 2;
		}
	}
</style>
