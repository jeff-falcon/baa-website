<script lang="ts">
	import { isFooterLight, isMenuOpenComplete } from '$lib/store';
	import type { Config } from '$lib/types';

	export let config: Config;
	export let hasDivider = false;
</script>

<footer class="isLight gutter" id="footer" class:hasDivider class:isDisabled={$isMenuOpenComplete}>
	<div class="content">
		<p>Discuss the future, a project and collaboration:</p>
		<p><a href="mailto:hello@baa-global.com">hello@baa-global.com</a></p>
	</div>
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
			<p class="copyright">© {new Date().getFullYear()} BAA Inc.</p>
			<p class="tanka"><a href="https://tankadesign.com" target="_blank">Site by TANKA</a></p>
		</div>
	</div>
</footer>

<style>
	footer {
		margin-top: 88px;
	}
	footer.isDisabled {
		visibility: hidden;
	}
	footer.hasDivider {
		padding-top: 40px;
		border-top: 1px solid var(--text-color-15);
	}
	.content {
		padding-bottom: 48px;
	}
	.content p {
		margin: 0;
		padding: 0 0 var(--24pt);
	}
	.content a {
		text-decoration: underline;
		text-decoration-color: rgba(0, 0, 0, 0.45);
		text-decoration-thickness: 1px;
	}
	.content > :last-child {
		padding-bottom: 0;
	}
	.bottom-row {
		border-top: 1px solid var(--text-color-15);
		padding-top: var(--24pt);
		padding-bottom: var(--24pt);
		display: flex;
		justify-content: space-between;
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
	}
	.socials .links a {
		display: inline-flex;
		border-radius: 40px;
		border: 1px solid var(--text-color-15);
		width: 48px;
		height: 48px;
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
	:global(.bg-is-light) .socials .links a img {
		filter: invert(1);
	}
	.socials .links a:hover {
		border-color: var(--text-color);
	}
	@media (min-width: 720px) {
		footer:not(.isLight) {
			margin-top: 128px;
		}
		footer.isLight {
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
	}
</style>
