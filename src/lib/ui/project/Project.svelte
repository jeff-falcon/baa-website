<script lang="ts">
	import ProjectMediaComponent from '$lib/ui/project/ProjectMediaComponent.svelte';
	import { PortableText } from '@portabletext/svelte';
	import type { Project, ProjectGrid } from '$lib/types';
	import { fly, type FlyParams } from 'svelte/transition';
	import { cubicOut, expoOut } from 'svelte/easing';
	import ProjectGridComponent from './ProjectGrid.svelte';
	import { getContrastYIQFromColor } from '$lib/color';

	export let project: Project;

	const flyProps: FlyParams = { opacity: 0, y: 30, easing: expoOut, duration: 1500 };

	$: hasDescription = project.description || project.descriptionIntro;
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
</script>

<div
	class="project-view"
	style="--related-section-bg: {project.relatedProjectsBgColor ?? 'transparent'}"
	class:hasRelatedBg
	class:relatedBgIsLight
>
	{#if project.name}
		<section class="gutter project-info">
			{#if hasDescription}
				{#if project.descriptionIntro}
					<div class="description intro" in:fly|global={{ ...flyProps }}>
						<PortableText value={project.descriptionIntro} />
					</div>
				{/if}
				{#if project.description}
					<div class="description extra" in:fly|global={{ ...flyProps, delay: 200 }}>
						<PortableText value={project.description} />
					</div>
				{/if}
			{/if}
			<div class="name-credits">
				<h3 class="project-name" in:fly|global={{ ...flyProps, delay: 75 }}>{project.title}</h3>
				{#if project.credits}
					<div class="credits">
						{#each project.credits as credit, index (credit)}
							<div class="credit" in:fly|global={{ ...flyProps, delay: index * 60 + 140 }}>
								{#if credit.name}
									<h3 class="name">{credit.name}</h3>
								{/if}
								{#if credit.credit}
									<p class="value">{credit.credit}</p>
								{/if}
							</div>
						{/each}
					</div>
				{/if}
			</div>
		</section>
	{/if}
	{#if project.media}
		<section class="medias gutter">
			{#each project.media as item, index}
				{#if item._type === 'project_media'}
					<ProjectMediaComponent media={item} scaleOnReveal={index === 0} />
				{/if}
				{#if item._type === 'item_pair'}
					{@const leftRatio = (item.left.image?.height ?? 100) / (item.left.image?.width ?? 100)}
					{@const rightRatio = (item.right.image?.height ?? 100) / (item.right.image?.width ?? 100)}

					<div
						class="pair"
						class:isLeftLarger={leftRatio > rightRatio}
						class:isRightLarger={leftRatio < rightRatio}
					>
						<ProjectMediaComponent media={item.left} scaleOnReveal={index === 0} />
						<ProjectMediaComponent media={item.right} scaleOnReveal={index === 0} />
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
	.medias,
	.pair {
		display: grid;
		grid-template-columns: repeat(1, 1fr);
		gap: var(--gutter-sm);
	}
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

	@media (min-width: 720px) {
		.medias {
			gap: var(--gutter-lg);
		}
		.pair {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			gap: var(--gutter-lg);
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
