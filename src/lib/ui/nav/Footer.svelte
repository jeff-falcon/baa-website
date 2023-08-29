<script lang="ts">
	import { isMenuOpenComplete } from '$lib/store';
	import type { Config } from '$lib/types';
	import Contact from '../form/Contact.svelte';
	import NewsletterSignup from '../form/NewsletterSignup.svelte';
	import Location from './Location.svelte';

	export let config: Config;
	export let hasContactForm = false;
	export let hasDivider = false;

	const style =
		config.borderRadius != null ? `--input-border-radius: ${config.borderRadius}px` : '';
</script>

<footer
	class="gutter"
	id="footer"
	class:hasDivider
	class:hasContactForm
	class:isDisabled={$isMenuOpenComplete}
	{style}
>
	{#if hasContactForm}
		<div class="contact">
			<Contact />
		</div>
	{/if}
	<div class="signup-socials-row">
		<div class="newsletter">
			<NewsletterSignup />
		</div>
		<div class="socials">
			<h3 class="title">{config.socials.name}</h3>
			<div class="links">
				{#each config.socials.links as link}
					<a href={link.url} target="_blank">
						<img src={link.icon} width="16" height="16" alt={link.name} />
					</a>
				{/each}
			</div>
		</div>
	</div>
	<div class="locations">
		{#each config.locations as location (location.name)}
			<Location {location} />
		{/each}
	</div>
	<div class="credits">
		<p class="copyright">© {new Date().getFullYear()} Bespoke Digital</p>
		<p class="tanka"><a href="https://tankadesign.com" target="_blank">Site by TANKA</a></p>
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
	.signup-socials-row {
		border-top: 1px solid var(--text-color-15);
		padding-top: 40px;
	}
	.contact + .signup-socials-row {
		margin-top: 48px;
	}
	footer :global(h3.title) {
		font-size: var(--18pt);
		line-height: var(--24pt);
		font-weight: bold;
		margin: 0 0 var(--24pt);
	}
	.locations {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 48px var(--gutter-sm);
		margin-top: 48px;
		padding-top: 48px;
		border-top: 1px solid var(--text-color-15);
	}

	.credits .tanka a {
		display: inline-block;
		transition: opacity 0.2s linear;
		transform: translateZ(0);
	}
	.credits .tanka a:hover {
		opacity: 0.98;
	}

	.credits {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		margin-top: 68px;
		margin-bottom: 32px;
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
	}
	:global(.bg-is-light) .socials .links a img {
		filter: invert(1);
	}
	.socials .links a:hover {
		border-color: var(--text-color);
	}
	.newsletter {
		margin-bottom: 40px;
	}
	@media (min-width: 720px) {
		footer {
			margin-top: 128px;
		}
		.signup-socials-row {
			display: grid;
			grid-template-columns: repeat(12, 1fr);
			gap: 0 var(--gutter-lg);
		}
		.newsletter {
			grid-column: 1 / span 7;
			margin-bottom: 0;
		}
		.newsletter :global(.sign-up-form form) {
			display: flex;
			flex-direction: row;
			gap: 16px;
		}
		.newsletter :global(.sign-up-form .textfield-container) {
			width: 100%;
			max-width: 376px;
		}
		.newsletter :global(button) {
			width: auto;
			padding-left: 40px;
			padding-right: 40px;
			white-space: nowrap;
		}
		.socials {
			grid-column: 9 / span 4;
			width: min-content;
			justify-self: end;
		}
		.locations {
			grid-template-columns: repeat(4, 1fr);
			gap: 48px var(--gutter-lg);
		}
		.contact {
			display: grid;
			grid-template-columns: repeat(12, 1fr);
			gap: var(--gutter-lg);
		}
		.contact :global(.contact-form) {
			grid-column: 1 / span 12;
		}
	}
	/* @media (min-width: 860px) {
		.contact :global(.contact-form) {
			grid-column: 1 / span 9;
		}
	}
	@media (min-width: 1100px) {
		.contact :global(.contact-form) {
			grid-column: 1 / span 8;
		}
	}
	@media (min-width: 1280px) {
		.contact :global(.contact-form) {
			grid-column: 1 / span 6;
		}
	} */
</style>
