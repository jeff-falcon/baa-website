<script lang="ts">
	import ProjectMediaComponent from '$lib/ui/project/ProjectMediaComponent.svelte';
	import { PortableText } from '@portabletext/svelte';
	import type { Project, ProjectGrid, Artist } from '$lib/types';
	import type { fly, FlyParams } from 'svelte/transition';
	import { cubicOut, expoOut } from 'svelte/easing';
	import ProjectGridComponent from './ProjectGrid.svelte';
	import { getContrastYIQFromColor } from '$lib/color';

	export let project: Project;
	export let artist: Artist | undefined = undefined;

	const flyProps: FlyParams = { opacity: 0, y: 30, easing: expoOut, duration: 1500 };

	let scrollY = 0;

	$: relatedProjects =
		project.showRelatedProjects && (project.relatedProjects?.length || 0)
			? <ProjectGrid>{
					title: 'Related Projects',
					projects: project.relatedProjects,
					_type: 'project_grid'
			  }
			: null;

	$: hasRelatedBg =
		project.relatedProjectsBgColor && project.relatedProjectsBgColor !== 'transparent';
	$: relatedBgIsLight = hasRelatedBg
		? getContrastYIQFromColor(project.relatedProjectsBgColor!) === 'black'
		: false;

	$: isMobile = typeof window !== 'undefined' && window.innerWidth < 720;
	$: isTitleVisible = scrollY < (isMobile ? 80 : 96);

	const tags = project.tags?.join(', ') ?? '';

	const firstIsVideoPlayer =
		project.media?.[0]?._type === 'project_media' && project.media?.[0]?.kind === 'video-player';
</script>

<svelte:window bind:scrollY />

<div
	class="project-view"
	style="--related-section-bg: {project.relatedProjectsBgColor ?? 'transparent'}"
	class:hasRelatedBg
	class:relatedBgIsLight
	class:hasTitle={project.title && firstIsVideoPlayer}
>
	{#if project.media}
		<section class="medias">
			{#each project.media as item, index (item)}
				{#if item._type === 'project_media'}
					<ProjectMediaComponent
						media={item}
						scaleOnReveal={index === 0}
						title={index === 0 && project.title ? project.title : ''}
						subtitle={index === 0 && tags ? tags : ''}
						{isTitleVisible}
					/>
				{:else if item._type === 'item_pair'}
					{@const leftRatio = (item.left.image?.height ?? 100) / (item.left.image?.width ?? 100)}
					{@const rightRatio = (item.right.image?.height ?? 100) / (item.right.image?.width ?? 100)}
					<div
						class="pair"
						class:isLeftLarger={leftRatio > rightRatio}
						class:isRightLarger={leftRatio < rightRatio}
						data-ratio-left={leftRatio}
						data-ratio-right={rightRatio}
					>
						<ProjectMediaComponent
							media={item.left}
							scaleOnReveal={index === 0}
							title={index === 0 && project.title ? project.title : ''}
							subtitle={index === 0 && tags ? tags : ''}
							{isTitleVisible}
						/>
						<ProjectMediaComponent media={item.right} scaleOnReveal={index === 0} />
					</div>
				{:else if item._type === 'item_trio'}
					<div class="trio {item.align}">
						<ProjectMediaComponent media={item.top} scaleOnReveal={index === 0} />
						<ProjectMediaComponent media={item.bottom} scaleOnReveal={index === 0} />
						<ProjectMediaComponent media={item.side} scaleOnReveal={index === 0} />
					</div>
				{/if}
			{/each}
		</section>
	{/if}
	{#if relatedProjects}
		<ProjectGridComponent data={relatedProjects} />
	{/if}
</div>

<style>
	.project-info {
		display: grid;
		grid-template-areas:
			'description-intro'
			'name-credits'
			'description-extra';
		padding-top: 120px;
		padding-bottom: 40px;
	}
	.description.intro {
		grid-area: description-intro;
		font-size: var(--18pt);
		line-height: var(--24pt);
	}
	.description.extra {
		grid-area: description-extra;
		font-size: var(--16pt);
		line-height: var(--24pt);
		opacity: 0.6;
		margin-top: var(--32pt);
	}
	.description :global(p),
	.description :global(li) {
		font-size: inherit;
		line-height: inherit;
		margin: 1.25em 0;
	}
	.description :global(> p:first-of-type),
	.description :global(> p:first-of-type) {
		margin-top: 0;
	}
	.description :global(> p:last-of-type),
	.description :global(> p:last-of-type) {
		margin-bottom: 0;
	}
	.name-credits {
		grid-area: name-credits;
		display: flex;
		flex-direction: column;
		gap: var(--24pt);
		margin-top: var(--32pt);
		padding-top: var(--24pt);
		border-top: 1px solid rgba(255, 255, 255, 0.15);
	}
	.project-name {
		font-size: var(--18pt);
		line-height: var(--24pt);
		margin: 0;
		font-weight: bold;
	}
	.credits .name,
	.credits .value {
		font-size: var(--14pt);
		line-height: var(--24pt);
		margin: 0;
	}
	.credits .name {
		font-weight: bold;
	}
	.credits .value {
		font-weight: normal;
	}
	.credit + .credit {
		margin-top: var(--24pt);
	}
	.medias + :global(.project-grid) {
		background-color: var(--related-section-bg);
		margin-top: 4rem;
	}
	.hasRelatedBg :global(.project-grid) {
		color: var(--text-light);
	}
	.hasRelatedBg.relatedBgIsLight :global(.project-grid) {
		color: var(--bg-dark);
	}
	.hasTitle {
		padding-top: var(--site-top-padding);
	}

	.medias :global(.video-player + .video-player) {
		margin-top: 0;
	}
	.medias :global(:first-child) {
		margin-top: 0;
	}

	@media (min-width: 720px) {
		.pair,
		.trio {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
		}
		.isRightLarger :global(.media:nth-of-type(1)),
		.isLeftLarger :global(.media:nth-of-type(2)) {
			position: relative;
			height: 100%;
		}
		.isRightLarger :global(.media:nth-of-type(1) img),
		.isRightLarger :global(.media:nth-of-type(1) picture),
		.isLeftLarger :global(.media:nth-of-type(2) img),
		.isLeftLarger :global(.media:nth-of-type(2) picture) {
			position: absolute;
			top: 0;
			left: 0;
			height: 100%;
			width: 100%;
		}
		.isRightLarger :global(.media:nth-of-type(1) img),
		.isLeftLarger :global(.media:nth-of-type(2) img) {
			object-fit: cover;
		}
		.trio.left :global(.project:nth-of-type(1)) {
			grid-column: 2 / span 1;
			grid-row: 1;
		}
		.trio.left :global(.project:nth-of-type(2)) {
			grid-column: 2 / span 1;
			grid-row: 2;
		}
		.trio.left :global(.project:nth-of-type(3)) {
			grid-column: 1 / span 1;
		}
		.trio.right :global(.project:nth-of-type(1)) {
			grid-column: 1 / span 1;
			grid-row: 1;
		}
		.trio.right :global(.project:nth-of-type(2)) {
			grid-column: 1 / span 1;
			grid-row: 2;
		}
		.trio.right :global(.project:nth-of-type(3)) {
			grid-column: 2 / span 1;
		}
		.trio :global(.project:nth-of-type(3)) {
			grid-row: 1 / span 2;
			position: relative;
		}
		.trio :global(.project:nth-of-type(3) figure) {
			padding-top: 0;
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
		}
	}
	@media (min-width: 960px) {
		.project-info {
			grid-template-areas:
				'description-intro name-credits'
				'description-extra name-credits';
			grid-template-columns: 8fr 4fr;
			gap: var(--32pt) calc(var(--gutter-lg) + var(--column-width));
			padding-top: 128px;
			padding-bottom: 68px;
		}
		.name-credits {
			padding-top: 0;
			margin-top: 0;
			border-top: 0;
			gap: 40px;
		}
		.project-name {
			font-size: var(--20pt);
			margin: 0;
			padding-top: 0;
			border-top: 0;
		}
		.credits .name,
		.credits .value {
			font-size: var(--16pt);
		}

		.description.intro {
			font-size: var(--20pt);
			line-height: var(--32pt);
		}
		.description.extra {
			margin-top: 0;
			font-size: var(--18pt);
			line-height: var(--24pt);
		}
		.medias + :global(.project-grid) {
			padding-top: 8rem;
			padding-bottom: 8rem;
		}
		.hasRelatedBg .medias + :global(.project-grid) {
			margin-top: 8rem;
		}
	}
</style>
