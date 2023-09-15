<script lang="ts">
	import type { ColumnedText } from '$lib/types';
	import { PortableText } from '@portabletext/svelte';

	export let data: ColumnedText;

	$: hasTitle = data.title && data.title.length > 0;
</script>

<section class="columned-text gutter layout-{data.layout}">
	<div class="wrap">
		{#if hasTitle}
			<h1 class="title">{data.title}</h1>
		{/if}
	</div>

	{#if data.body?.length ?? 0}
		<div class="columns" style="--max-columns: {data.body.length}">
			{#each data.body as column (column)}
				<div class="column">
					{#if hasTitle}
						<h3 class="title">{column.title}</h3>
						<hr />
					{:else if column.title}
						<h1 class="title">{column.title}</h1>
						<hr />
					{/if}
					<div class="body">
						<PortableText value={column.body} />
					</div>
				</div>
			{/each}
		</div>
	{/if}
</section>

<style>
	section {
		padding-top: 3rem;
		padding-bottom: 3rem;
		overflow-x: hidden;
		overflow-y: auto;
	}
	.column hr {
		width: 48px;
		height: 1px;
		background: var(--text-color);
		opacity: 0.15;
		border: 0;
		margin: -8px 0 var(--24pt);
	}
	section :global(ul) {
		list-style: none;
		padding: 0;
		margin: 0;
		font-weight: normal;
		padding-bottom: 1rem;
	}
	section :global(li) {
		margin: 0;
		padding-bottom: 0.5rem;
	}
	.wrap .title {
		margin: 0 0 var(--16pt);
	}
	section :global(p) {
		margin: 0;
		padding: 0 0 var(--24pt);
	}
	h1.title {
		text-transform: uppercase;
		font-size: 3rem;
		line-height: 1.12;
	}
	.columns {
		display: grid;
		grid-template-columns: repeat(1, 1fr);
		gap: 40px;
	}
	.column .title {
		margin-top: 0;
	}
	.column .body :global(p:first-of-type) {
		margin-top: 0;
	}
	.column .body :global(p:last-of-type) {
		margin-bottom: 0;
	}
	.column .body :global(h3) {
		font-size: var(--18pt);
		line-height: var(--24pt);
		text-transform: uppercase;
		font-weight: bold;
		margin: 0 0 var(--16pt);
	}
	@media (min-width: 840px) {
		.columns {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			gap: 56px var(--gutter-lg);
		}
		.layout-even .columns {
			grid-template-columns: repeat(2, 1fr);
		}
		.layout-left .columns,
		.layout-right .columns {
			grid-template-columns: repeat(12, 1fr);
		}
		.layout-left .column:first-of-type {
			grid-column: 1 / span 7;
		}
		.layout-left .column:last-of-type {
			grid-column: 9 / span 4;
		}
		.layout-right .column:first-of-type {
			grid-column: 1 / span 4;
		}
		.layout-right .column:last-of-type {
			grid-column: 6 / span 7;
		}
	}
	@media (min-width: 720px) {
		section {
			padding-top: 4rem;
			padding-bottom: 4rem;
		}
		.column hr {
			margin: -8px 0 var(--32pt);
		}
		.wrap .title {
			margin: 0 0 48px;
			margin-bottom: var(--32pt);
		}
		h1.title {
			font-size: 4.75rem;
		}
		section :global(p) {
			padding-bottom: var(--24pt);
		}
		.column .body :global(h3) {
			font-size: var(--20pt);
			margin-bottom: var(--20pt);
		}
	}
</style>
