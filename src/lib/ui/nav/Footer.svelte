<script lang="ts">
	import { isFooterLight, isMenuOpenComplete, footerHasContactInfo } from '$lib/store';
	import type { Config } from '$lib/types';
	import { PortableText } from '@portabletext/svelte';

	export let config: Config;
	export let hasDivider = false;
</script>

<footer class="isLight gutter" id="footer" class:hasDivider class:isDisabled={$isMenuOpenComplete}>
	{#if $footerHasContactInfo}
		<div class="content">
			<PortableText value={config.contactInfo} />
		</div>
	{/if}
	<div class="bottom-row">
		<div class="socials">
			<div class="links">
				{#each config.socials.links as link}
					<a href={link.url} target="_blank">
						<span class="name">{link.name}</span>
						<img src={link.icon} width="16" height="16" alt={link.name} />
					</a>
				{/each}
			</div>
		</div>
		<div class="credits">
			<p class="copyright">© {new Date().getFullYear()} BAA Global</p>
			<p class="tanka"><a href="https://tankadesign.com" target="_blank">Site by TANKA</a></p>
		</div>
	</div>
</footer>

<style>
	footer {
		margin-top: 88px;
	}
	footer.isDisabled {
		pointer-events: none;
	}
	footer.hasDivider {
		padding-top: 40px;
		border-top: 1px solid var(--text-color-15);
	}
	.content {
		padding-bottom: 48px;
	}
	.content :global(p) {
		margin: 0;
		padding: 0 0 var(--24pt);
	}
	.content :global(a) {
		text-decoration: underline;
		text-decoration-color: rgba(0, 0, 0, 0.45);
		text-decoration-thickness: 1px;
	}
	.content :global(> :last-child) {
		padding-bottom: 0;
	}
	.bottom-row {
		border-top: 1px solid var(--text-color-15);
		padding-top: var(--24pt);
		padding-bottom: var(--24pt);
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	footer :global(h3.title) {
		font-size: var(--18pt);
		line-height: var(--24pt);
		font-weight: bold;
		margin: 0 0 var(--24pt);
	}
	footer.isLight {
		background: var(--bg-light);
		color: var(--text-dark);
		--text-color-15: var(--text-dark-15);
		--text-color-40: var(--text-dark-40);
		--text-color: var(--text-dark);
		margin-top: 0;
	}
	footer.isLight .content {
		padding-top: 120px;
	}

	.credits .tanka a {
		display: inline-block;
		transition: opacity 0.2s linear;
		transform: translateZ(0);
		text-decoration: none;
	}
	.credits .tanka a:hover {
		opacity: 0.98;
	}

	.credits {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 16px;
	}
	.credits p {
		margin: 0;
		font-size: var(--12pt);
		line-height: var(--16pt);
	}
	.credits .copyright,
	.credits .tanka a {
		opacity: 0.6;
	}
	.socials .links {
		display: flex;
		gap: 16px;
		transform: translateX(-8px);
	}
	.socials .links a {
		display: inline-flex;
		border-radius: 0;
		border: 0;
		width: 32px;
		height: 32px;
		align-items: center;
		justify-content: center;
		transition: border-color 180ms linear;
		text-decoration: none;
	}
	.socials .links a .name {
		font-size: var(--16pt);
		font-weight: bold;
		color: var(--text-dark);
		display: none;
	}
	.socials .links a:hover .name {
		text-decoration: underline 1px var(--text-color-40);
	}
	.socials .links a img {
		width: 20px;
		height: 20px;
		display: block;
	}
	footer.isLight .socials .links a img {
		filter: invert(1);
	}
	.socials .links a:hover {
		border-color: var(--text-color);
	}
	@media (min-width: 720px) {
		footer:not(.isLight) {
			margin-top: 128px;
		}
		footer.isLight .content {
			padding-top: 240px;
		}
		.content {
			padding-bottom: 96px;
		}
		.socials {
			grid-column: 9 / span 4;
			width: min-content;
			justify-self: end;
		}
		.socials .links {
			gap: 32px;
			transform: none;
		}
		.socials .links a {
			border: 0;
			border-radius: 0;
			width: auto;
			height: auto;
		}
		.socials .links a img {
			display: none;
		}
		.socials .links a .name {
			display: inline-block;
		}
		.credits {
			gap: var(--32pt);
		}
	}
</style>
