<script lang="ts">
	import ProjectMediaComponent from '$lib/ui/project/ProjectMediaComponent.svelte';
	import { PortableText } from '@portabletext/svelte';
	import type { Project, Artist } from '$lib/types';
	import { getContrastYIQFromColor } from '$lib/color';
	import { onMount } from 'svelte';
	import { footerHasContactInfo, footerHasNewsletterForm } from '$lib/store';
	import { fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	export let project: Project;
	export let artist: Artist | undefined = undefined;

	let scrollY = 0;

	$: hasRelatedBg =
		project.relatedProjectsBgColor && project.relatedProjectsBgColor !== 'transparent';
	$: relatedBgIsLight = hasRelatedBg
		? getContrastYIQFromColor(project.relatedProjectsBgColor!) === 'black'
		: false;

	$: isMobile = typeof window !== 'undefined' && window.innerWidth < 720;
	$: isTitleVisible = scrollY < (isMobile ? 80 : 96);
	$: hasDetails = project.description || project.descriptionIntro || project.credits?.length;

	const tags = project.tags?.join(', ') ?? '';

	const firstIsVideoPlayer =
		project.media?.[0]?._type === 'project_media' && project.media?.[0]?.kind === 'video-player';

	onMount(() => {
		footerHasContactInfo.set(true);
		footerHasNewsletterForm.set(true);
	});
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
					{@const isHero = index === 0 && item.kind !== 'video-player'}
					<div class="single" class:isHero>
						{#key `media-single-${item._key}`}
							<ProjectMediaComponent
								media={item}
								cover={isHero}
								scaleOnReveal={index === 0}
								title={index === 0 && project.title ? project.title : ''}
								preTitle={index === 0 && tags ? tags : artist?.name ?? ''}
								{isTitleVisible}
							/>
						{/key}
					</div>
				{:else if item._type === 'item_pair'}
					{@const leftRatio = (item.left.image?.height ?? 100) / (item.left.image?.width ?? 100)}
					{@const rightRatio = (item.right.image?.height ?? 100) / (item.right.image?.width ?? 100)}
					{@const hasTitle = Boolean(index === 0 && project.title)}
					<div
						class="pair"
						class:isLeftLarger={leftRatio > rightRatio}
						class:isRightLarger={leftRatio < rightRatio}
						data-ratio-left={leftRatio}
						data-ratio-right={rightRatio}
						class:hasTitle
					>
						{#if index === 0 && project.title}
							<div class="title-wrap gutter" style="opacity: {isTitleVisible ? 1 : 0}">
								{#if artist?.name}
									<h2
										class="pre-title"
										in:fly|global={{
											y: 0,
											opacity: 0,
											easing: cubicOut,
											duration: 750,
											delay: 100
										}}
									>
										{artist.name}
									</h2>
								{/if}
								<h1
									class="title"
									in:fly|global={{ y: 0, opacity: 0, duration: 750, delay: 150, easing: cubicOut }}
								>
									{project.title}
								</h1>
							</div>
						{/if}
						{#key `media-left-${item.left._key}`}
							<ProjectMediaComponent
								isInsidePair={true}
								media={item.left}
								scaleOnReveal={index === 0}
								aspectRatio={hasTitle ? undefined : leftRatio}
							/>
						{/key}
						{#key `media-right-${item.right._key}`}
							<ProjectMediaComponent
								isInsidePair={true}
								media={item.right}
								scaleOnReveal={index === 0}
								aspectRatio={hasTitle ? undefined : rightRatio}
							/>
						{/key}
					</div>
				{:else if item._type === 'item_trio'}
					<div class="trio {item.align ?? 'left'}">
						{#key `media-trio-top-${item.top._key}`}
							<ProjectMediaComponent media={item.top} scaleOnReveal={index === 0} />
						{/key}
						{#key `media-trio-bottom-${item.bottom._key}`}
							<ProjectMediaComponent media={item.bottom} scaleOnReveal={index === 0} />
						{/key}
						{#key `media-trio-side-${item.side._key}`}
							<ProjectMediaComponent
								media={item.side}
								cover="desktop"
								scaleOnReveal={index === 0}
							/>
						{/key}
					</div>
				{/if}
			{/each}
		</section>
	{/if}
</div>
{#if hasDetails}
	<section class="project-info gutter">
		<div class="wrap">
			{#if project.credits?.length}
				<ul class="credits">
					{#each project.credits as credit, index (credit)}
						<li class="credit">
							{#if credit.name}
								<h3 class="name">{credit.name}</h3>
							{/if}
							{#if credit.credit}
								<p class="value">{credit.credit}</p>
							{/if}
						</li>
					{/each}
				</ul>
			{/if}
			{#if project.descriptionIntro}
				<div class="description intro">
					<PortableText value={project.descriptionIntro} components={{}} />
				</div>
			{/if}
			{#if project.description}
				<div class="description extra">
					<PortableText value={project.description} components={{}} />
				</div>
			{/if}
		</div>
	</section>
{/if}

<style>
	.description.intro {
		font-size: var(--18pt);
		line-height: var(--24pt);
	}
	.description.extra {
		font-size: var(--16pt);
		line-height: var(--24pt);
		opacity: 0.6;
	}
	.credits + .description,
	.description + .description.extra {
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
	.credits {
		list-style-type: none;
		padding: 0;
		margin: 0;
	}
	.credits li {
		margin-top: 0;
	}
	.credits .name,
	.credits .value {
		font-size: var(--14pt);
		line-height: var(--24pt);
		margin: 0;
	}
	.credits .name {
		font-weight: bold;
		text-transform: uppercase;
	}
	.credits .value {
		font-weight: normal;
	}
	.credit + .credit {
		margin-top: var(--24pt);
	}
	.medias {
		padding-bottom: 0;
		background: var(--bg-dark);
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
	.project-view.hasTitle {
		padding-top: var(--site-top-padding);
	}

	.medias :global(.video-player + .video-player) {
		margin-top: 0;
	}
	.medias :global(:first-child) {
		margin-top: 0;
	}
	.medias .single.isHero {
		height: 100vh;
		height: 100svh;
	}
	.pair,
	.trio {
		position: relative;
	}
	.project-info {
		background: var(--bg-light);
		color: var(--text-dark);
		padding-top: 4rem;
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: var(--gutter-lg);
	}
	.project-info .wrap {
		grid-column: 1 / span 4;
	}
	.pair :global(.media:nth-of-type(2) .title-wrap *) {
		opacity: 0;
	}
	.pair .title-wrap {
		margin-bottom: var(--24pt);
		transition: opacity linear 300ms;
	}
	.pair .title-wrap {
		width: 100%;
		margin-bottom: 0;
		padding-bottom: var(--24pt);
		padding-top: 40px;
		background: linear-gradient(to bottom, hsla(0, 0%, 15%, 0) 0%, hsla(0, 0%, 15%, 0.6) 100%);
		position: fixed;
		bottom: 0;
		z-index: 2;
		--text-color: var(--text-light);
		--text-color-40: var(--text-light-40);
		color: var(--text-color);
	}
	.pair .title {
		margin: 0;
		line-height: 1;
	}
	.pair .title-wrap .pre-title {
		border-top: 1px solid var(--text-color-40);
		padding-top: var(--24pt);
		line-height: 1.12;
		text-transform: uppercase;
		font-size: var(--18pt);
		font-weight: bold;
		margin: 0 0 10px;
	}
	.pair.hasTitle :global(.media:nth-of-type(1)) {
		z-index: 0;
	}
	.pair.hasTitle :global(.media:nth-of-type(1)),
	.pair.hasTitle :global(.media:nth-of-type(1) picture),
	.pair.hasTitle :global(.media:nth-of-type(1) img) {
		height: 100vh;
	}
	.pair.hasTitle :global(.media:nth-of-type(1) img) {
		object-fit: cover;
	}
	@media (min-width: 720px) {
		.pair.hasTitle {
			height: 100vh;
			min-height: 500px;
		}
		.pair .title-wrap {
			position: absolute;
		}
		.pair .title-wrap .title {
			font-size: 4.25rem;
			line-height: 1;
		}
		.pair.hasTitle :global(.media:nth-of-type(2)),
		.pair.hasTitle :global(.media:nth-of-type(2) picture),
		.pair.hasTitle :global(.media:nth-of-type(2) img) {
			height: 100vh;
		}
		.pair.hasTitle :global(.media:nth-of-type(2) img) {
			object-fit: cover;
		}
		.pair,
		.trio {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
		}
		.trio {
			overflow: hidden;
			position: relative;
		}
		.isRightLarger :global(.media:nth-of-type(1)),
		.isLeftLarger :global(.media:nth-of-type(2)) {
			position: relative;
			height: 100%;
		}
		.isRightLarger :global(.media:nth-of-type(1) .img),
		.isRightLarger :global(.media:nth-of-type(1) .pic),
		.isLeftLarger :global(.media:nth-of-type(2) .img),
		.isLeftLarger :global(.media:nth-of-type(2) .pic) {
			position: absolute;
			top: 0;
			left: 0;
			height: 100%;
			width: 100%;
		}
		.isRightLarger :global(.media:nth-of-type(1) .img),
		.isLeftLarger :global(.media:nth-of-type(2) .img) {
			object-fit: cover;
		}
		.trio.left :global(.media:nth-of-type(1)) {
			grid-column: 2 / span 1;
			grid-row: 1;
		}
		.trio.left :global(.media:nth-of-type(2)) {
			grid-column: 2 / span 1;
			grid-row: 2;
		}
		.trio.left :global(.media:nth-of-type(3)) {
			grid-column: 1 / span 1;
		}
		.trio.right :global(.media:nth-of-type(1)) {
			grid-column: 1 / span 1;
			grid-row: 1;
		}
		.trio.right :global(.media:nth-of-type(2)) {
			grid-column: 1 / span 1;
			grid-row: 2;
		}
		.trio.right :global(.media:nth-of-type(3)) {
			grid-column: 2 / span 1;
		}
		.trio :global(.media:nth-of-type(3)) {
			grid-row: 1 / span 2;
			position: relative;
		}
		.trio.right :global(.media:nth-of-type(3)) {
			padding-top: 0;
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
		}
		.project-info {
			grid-template-columns: repeat(12, 1fr);
			padding-top: 8rem;
		}
		.project-info .wrap {
			grid-column: 2 / span 7;
			padding-left: 0;
		}
	}
	@media (min-width: 960px) {
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
	@media (min-width: 1280px) {
		.pair .title-wrap .title {
			font-size: 4.75rem;
		}
	}
</style>
