<script lang="ts">
	import type { Page } from '$lib/types';
	import PageComponent from '$lib/ui/page/Page.svelte';
	import type { PageData } from './$types';
	export let data: PageData;
</script>

{#key data._id}
	{#if data._type === 'page'}
		<PageComponent {data} />
	{/if}
{/key}
