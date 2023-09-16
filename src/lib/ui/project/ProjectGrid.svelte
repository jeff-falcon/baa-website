<script lang="ts">
	import type { ProjectGrid } from '$lib/types';
	import ArrowButton from '../button/ArrowButton.svelte';

	import ProjectThumb from './ProjectThumb.svelte';
	export let data: ProjectGrid;
</script>

<section class="project-grid gutter">
	{#if data.title || data.moreLink}
		<div class="header">
			{#if data.title}
				<h2 class="title">{data.title}</h2>
			{/if}
		</div>
	{/if}
	<div class="projects">
		{#each data.projects as project, index}
			<ProjectThumb url="" {project} size={index === 0 && data.useFeature ? 'full' : 'half'} />
		{/each}
	</div>
	{#if data.moreLink?.url}
		<div class="footer">
			<ArrowButton
				href={data.moreLink.url}
				title={data.moreLink?.buttonTitle ?? 'See more work'}
				style="capsule"
			/>
		</div>
	{/if}
</section>

<style>
	section {
		padding-top: 3rem;
		padding-bottom: 3rem;
	}
	.projects {
		display: flex;
		gap: 36px var(--gutter-sm);
		flex-direction: column;
	}
	.title {
		font-size: var(--22pt);
		line-height: var(--32pt);
		margin: 0;
	}
	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 24px;
	}
	.footer {
		margin-top: 48px;
		display: flex;
		justify-content: center;
	}
	section:global(:has(+ section.logo-grid)) {
		padding-bottom: 6rem;
	}
	@media (min-width: 720px) {
		section {
			padding-top: 4rem;
			padding-bottom: 4rem;
		}
		.projects {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			gap: 72px var(--gutter-lg);
		}
		.title {
			font-size: var(--26pt);
		}
		.header {
			margin-bottom: 44px;
		}
		.footer {
			margin-top: 80px;
		}
		section:global(:has(+ section.logo-grid)) {
			padding-bottom: 8rem;
		}
	}
</style>
