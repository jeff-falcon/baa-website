<script lang="ts">
	import type { Form } from '$lib/types';
	import { PortableText } from '@portabletext/svelte';
	import Contact from './Contact.svelte';
	import JobSubmission from './JobSubmission.svelte';
	export let data: Form;
</script>

<section class="gutter bg-{data.bgColor ?? 'transparent'}">
	<div class="wrap">
		<h2 class="title">{data.title}</h2>
		<div class="body">
			<PortableText value={data.body} />
		</div>

		<div class="form">
			{#if data.form === 'contact'}
				{#key data._id}
					<Contact mode="long" />
				{/key}
			{/if}
			{#if data.form === 'job'}
				{#key data._id}
					<JobSubmission mode="long" />
				{/key}
			{/if}
		</div>
	</div>
</section>

<style>
	section {
		padding-top: 3rem;
		padding-bottom: 3rem;
	}
	.body {
		opacity: 0.6;
		font-size: var(--16pt);
		line-height: var(--24pt);
	}
	.body :global(p) {
		font-size: inherit;
		line-height: inherit;
	}
	.form {
		margin-top: 48px;
	}
	.title {
		margin: 0 0 var(--16pt);
	}
	@media (min-width: 720px) {
		section {
			padding-top: 4rem;
			padding-bottom: 4rem;
			display: grid;
			grid-template-columns: repeat(12, 1fr);
			gap: var(--gutter-lg);
		}
		.wrap {
			grid-column: 3 / span 8;
		}
		.body {
			font-size: var(--18pt);
		}
		.title {
			margin-bottom: var(--24pt);
		}
	}
	@media (min-width: 1024px) {
		.wrap {
			grid-column: 2 / span 5;
		}
	}
</style>
