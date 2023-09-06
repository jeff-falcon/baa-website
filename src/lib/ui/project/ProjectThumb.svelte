<script lang="ts">
	import type { Project, ProjectMedia } from '$lib/types';
	import ProjectMediaComponent from '$lib/ui/project/ProjectMediaComponent.svelte';
	import ArrowButton from '../button/ArrowButton.svelte';

	export let project: Project;
	export let url: string;
	export let size: 'half' | 'full' = 'half';

	$: isFull = size === 'full';

	let media: ProjectMedia;
	$: media = {
		_type: 'project_media',
		_key: project.slug,
		name: project.title,
		kind: project.kind,
		image: project.image,
		videoBgSrc: project.videoBgSrc,
		videoBgSrcHd: project.videoBgSrcHd,
		useOriginalQuality: false,
		autoplay: true
	};
	$: name = project.shortName || project.title;
</script>

<article class="project" class:isFull data-slug={project.slug}>
	<a href={url}>
		<div class="thumbnail">
			<ProjectMediaComponent {media} cover={true} isFullWidth={isFull} />
		</div>
		<div class="info gutter">
			<div class="wrap">
				<div class="title-sub">
					<h2 class="title">{name}</h2>
					{#if project.client}
						<h3 class="subtitle">{project.client}</h3>
					{/if}
				</div>
				<div class="arrow">
					<ArrowButton isTitleHiddenOnMobile={true} isOverSolid={false} />
				</div>
			</div>
		</div>
	</a>
</article>

<style>
	.project {
		--aspect-pct: 100%;
	}
	.project.isFull {
		--aspect-pct: 194%;
	}
	.project a {
		display: block;
		text-decoration: none;
		padding-top: var(--aspect-pct);
		position: relative;
		background: var(--bg-dark);
	}
	.thumbnail {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 0;
		opacity: 0.7;
	}
	.info {
		position: absolute;
		z-index: 1;
		bottom: 0;
		width: 100%;
	}
	.info .wrap {
		padding-top: var(--20pt);
		border-top: 1px solid var(--text-light-40);
		align-items: flex-start;
		justify-content: space-between;
		display: flex;
		padding-bottom: var(--24pt);
	}
	.info .title-sub {
		display: flex;
		flex-direction: column;
		gap: 0;
		min-height: 3rem;
	}
	.info .title {
		font-size: var(--18pt);
		text-transform: uppercase;
		line-height: var(--24pt);
		font-weight: bold;
		display: inline-block;
		margin: 0;
	}
	.info .subtitle {
		font-size: var(--14pt);
		opacity: 0.6;
		line-height: var(--16pt);
		font-weight: bold;
		display: inline;
		white-space: nowrap;
		margin: 0;
	}
	@media (min-width: 720px) {
		.project {
			--aspect-pct: 81.78%;
		}
		.project.isFull {
			--aspect-pct: 63.2%;
			grid-column: 1 / span 2;
		}
		.info {
			display: block;
			margin-top: var(--32pt);
		}
		.info .title {
			margin-right: var(--16pt);
			font-size: var(--20pt);
		}
		.info .subtitle {
			font-size: var(--16pt);
			line-height: var(--24pt);
		}
	}
</style>
