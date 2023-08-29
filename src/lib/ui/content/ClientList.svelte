<script lang="ts">
	import type { ClientList } from '$lib/types';
	import { PortableText } from '@portabletext/svelte';

	export let data: ClientList;
</script>

<section class="client-list gutter bg-{data.bgColor ?? 'transparent'}">
	{#if data.title}
		<h2 class="title">{data.title}</h2>
	{/if}

	<div class="clients">
		{#each data.clients as client}
			<p>{client}</p>
		{/each}
	</div>
</section>

<style>
	section {
		padding-top: 3rem;
		padding-bottom: 3rem;
	}
	.title {
		border-bottom: 1px solid var(--text-light-15);
		padding-bottom: var(--32pt);
		margin: 0 0 var(--32pt);
	}
	.clients {
		font-size: var(--18pt);
		line-height: var(--24pt);
		opacity: 0.6;
		columns: 2;
	}
	.clients p {
		font-size: inherit;
		line-height: inherit;
	}
	@media (min-width: 720px) {
		section {
			padding-top: 4rem;
			padding-bottom: 4rem;
		}
		.clients {
			font-size: var(--20pt);
			line-height: var(--32pt);
		}
		.title {
			padding-bottom: 40px;
			margin-bottom: 56px;
		}
	}
	@media (min-width: 960px) {
		.clients {
			columns: 4;
		}
	}
	.clients p {
		margin: 0;
	}
</style>
