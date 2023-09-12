<script lang="ts">
	import type { ArtistHero, Hero, Project, ProjectMedia } from '$lib/types';
	import ArrowButton from '$lib/ui/button/ArrowButton.svelte';
	import ProjectMediaComponent from '../project/ProjectMediaComponent.svelte';

	export let data: ArtistHero;
	export let url: string;

	let scrollY = 0;
	let innerHeight = 0;

	let media: ProjectMedia;
	$: media = {
		_key: data._id,
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
	$: tags = data.project?.tags?.join(', ') ?? '';
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
				<a href={url} class="project">
					<div class="name-client">
						<h4 class="name">{data.project.shortName}</h4>
						{#if tags}
							<p class="client">{tags}</p>
						{/if}
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
		{#key data._id}
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
		font-size: var(--40pt);
		margin: 0;
		line-height: 1;
		text-transform: uppercase;
		font-weight: bold;
	}
	.subtitle {
		font-size: var(--14pt);
		line-height: var(--16pt);
		margin: var(--8pt) 0 0;
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
		display: none;
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
			grid-template-columns: repeat(12, 1fr);
			gap: var(--gutter-lg);
			align-items: end;
			padding-bottom: var(--32pt);
		}
		.wrap {
			grid-column: 5 / span 8;
		}
		.hero :global(+ section.text-only) {
			padding-top: 8rem;
		}
		.title {
			font-size: 4rem;
		}
		.subtitle {
			font-size: var(--14pt);
			line-height: var(--16pt);
			margin-top: var(--16pt);
		}
		.name-client .name {
			font-size: var(--20pt);
		}
	}
	@media (min-width: 960px) {
		.wrap {
			grid-column: 7 / span 6;
		}
	}
	@media (min-width: 1100px) {
		.title {
			font-size: 4.5rem;
			line-height: 0.96;
		}
	}
	@media (min-width: 1360px) {
		.title {
			font-size: 5.5rem;
		}
	}
</style>
