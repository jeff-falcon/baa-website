<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	onMount(() => {
		document.body.classList.add('isErrorPage');
		return () => {
			document.body.classList.remove('isErrorPage');
		};
	});
</script>

<section class="gutter">
	<h1>{$page.status}</h1>
	<h3>{$page.error?.message}</h3>
</section>

<style>
	section {
		padding-top: 5rem;
	}
	:global(body.isErrorPage > div) {
		height: 100vh;
		display: flex !important;
		flex-direction: column;
	}
	:global(body.isErrorPage main) {
		flex: 1;
	}
	:global(body.isErrorPage #footer) {
		margin-top: 0;
	}
	@media (min-height: 420px) {
		section {
			padding-top: 8rem;
		}
	}
</style>
