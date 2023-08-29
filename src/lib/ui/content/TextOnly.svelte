<script lang="ts">
	import type { TextOnly } from '$lib/types';
	import { PortableText } from '@portabletext/svelte';

	export let data: TextOnly;
</script>

<section class="text-only gutter bg-{data.bgColor ?? 'transparent'}">
	<div class="wrap">
		{#if data.title}
			<h2 class="title">{data.title}</h2>
		{/if}

		<PortableText value={data.body} />
	</div>
</section>

<style>
	section {
		padding-top: 3rem;
		padding-bottom: 3rem;
	}
	.wrap :global(> :first-child) {
		margin-top: 0;
	}
	.wrap :global(> :last-child) {
		margin-bottom: 0;
	}
	.title {
		margin: 0 0 var(--16pt);
	}
	@media (min-width: 720px) {
		section {
			padding-top: 4rem;
			padding-bottom: 4rem;
		}
		.text-only {
			display: grid;
			grid-template-columns: repeat(12, 1fr);
			gap: var(--gutter-lg);
		}
		.wrap {
			grid-column: 1 / span 10;
		}
		.title {
			margin-bottom: var(--32pt);
		}
	}
</style>
