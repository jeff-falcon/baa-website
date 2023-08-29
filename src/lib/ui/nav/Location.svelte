<script lang="ts">
	import type { Location } from '$lib/types';
	import LocaleTime from './LocaleTime.svelte';

	export let location: Location;

	$: email = location.email.toLowerCase().replace(/\s+/g, '').trim();
	$: address = location.address.replace(/\n/g, '<br/>');
</script>

<div class="location">
	<p class="name">{location.name}</p>
	<LocaleTime timezone={location.timezone} />
	<hr />
	<p class="address">{@html address}</p>
	<p class="email"><a href="mailto:{email}">{email}</a></p>
</div>

<style>
	p,
	.location :global(time) {
		margin: 0;
	}
	.name,
	.location :global(.time) {
		font-size: var(--22pt);
		line-height: var(--32pt);
	}
	.name {
		font-weight: bold;
	}
	hr {
		width: 48px;
		height: 1px;
		border: 0;
		background: var(--text-light-15);
		margin: 6px 0 12px;
	}
	.address,
	.email {
		font-size: var(--12pt);
		line-height: var(--24pt);
	}
	.address,
	.email a {
		opacity: 0.6;
	}
	.email a {
		display: inline-block;
		transition: opacity 0.2s linear;
		transform: translateZ(0);
	}
	.email a:hover {
		opacity: 0.98;
	}
</style>
