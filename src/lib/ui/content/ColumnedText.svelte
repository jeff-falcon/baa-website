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
	}
	.column hr {
		width: 48px;
		height: 1px;
		background: var(--text-color);
		opacity: 0.15;
		border: 0;
		margin: var(--16pt) 0;
	}
	section :global(ul) {
		list-style: none;
		padding: 0;
		margin: 0;
		font-weight: bold;
		padding-bottom: 1rem;
	}
	section :global(li) {
		margin: 0;
		padding-bottom: 1rem;
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
		font-size: 4.75rem;
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
	@media (min-width: 560px) {
		.columns {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			gap: 40px var(--gutter-sm);
		}
	}
	@media (min-width: 720px) {
		section {
			padding-top: 4rem;
			padding-bottom: 4rem;
		}
		.columns {
			gap: 56px var(--gutter-lg);
		}
		.layout-even .columns {
			grid-template-columns: repeat(2, 1fr);
		}
		.layout-left .columns,
		.layout-right .columns {
			grid-template-columns: repeat(12, 1fr);
		}
		.column hr {
			margin: var(--16pt) 0 var(--24pt);
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
		.layout-left .column:first-of-type {
			grid-column: 1 / span 6;
		}
		.layout-left .column:last-of-type {
			grid-column: 9 / span 4;
		}
		.layout-right .column:first-of-type {
			grid-column: 1 / span 4;
		}
		.layout-right .column:last-of-type {
			grid-column: 7 / span 6;
		}
	}
</style>
