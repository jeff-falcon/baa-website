<script lang="ts">
	import { page, navigating } from '$app/stores';
	import {
		isMenuOpenComplete,
		menuState,
		pageHasHero,
		bgColor,
		currentArtist,
		currentProject
	} from '$lib/store';
	import type { Config } from '$lib/types';
	import BAALogo from '$lib/ui/logos/BAALogoBitmap.svelte';

	import { cubicIn, cubicOut, expoOut, linear, sineInOut } from 'svelte/easing';
	import { fade, fly } from 'svelte/transition';

	export let config: Config;

	let scrollY = 0;
	let changeBgTimeout = 0;
	let hasBg = false;

	let currentLinkHover: HTMLAnchorElement | null = null;
	let menuStateTimeout = 0;

	$: if ($navigating?.type === 'popstate' || $navigating?.type === 'link') {
		if ($menuState === 'open') {
			toggleMenu();
		}
	}

	$: backgroundColor = $bgColor.startsWith('#')
		? `${$bgColor}CC`
		: `rgba(${$bgColor.replace('rgb(', '').replace(')', '')},0.8)`;
	$: style = `--bg-color: ${backgroundColor};}`;

	$: isScrolled = scrollY > 120;

	$: if ($pageHasHero) {
		clearTimeout(changeBgTimeout);
		hasBg = isScrolled;
	} else {
		clearTimeout(changeBgTimeout);
		if (typeof window !== 'undefined') {
			changeBgTimeout = window.setTimeout(() => {
				hasBg = true;
			}, 150);
		}
	}

	$: hasArtist = Boolean($currentArtist && $currentProject && isScrolled);

	$: menuLinks = [
		{
			name: 'Artists',
			url: '/',
			isActive: currentRoute === '/',
			children: config.artistMenu
		},
		{
			name: 'Latest',
			url: '/latest/',
			isActive: (currentRoute.indexOf('/latest') ?? -1) > -1,
			children: null
		},
		{
			name: 'Info',
			url: '/info/',
			isActive: (currentRoute.indexOf('/info') ?? -1) > -1,
			children: null
		}
	];

	$: currentRoute = $page.url.pathname ?? '';
	$: isMenuOpen = $menuState === 'open';
	$: mobileNavStyle = $bgColor ? `--bg-color: ${$bgColor};` : '';
	$: isShowingArtistHeader = hasArtist && !isMenuOpen;

	function replaceArtist(project: string) {
		return project.replace($currentArtist?.name + ' -', '').trim();
	}

	function toggleMenu() {
		menuState.update((state) => {
			const newState = state === 'open' ? 'closed' : 'open';
			clearTimeout(menuStateTimeout);
			if (newState === 'closed') {
				menuStateTimeout = window.setTimeout(() => {
					isMenuOpenComplete.set(false);
				}, 10);
			} else {
				menuStateTimeout = window.setTimeout(() => {
					isMenuOpenComplete.set(true);
				}, 500);
			}
			return newState;
		});
	}
</script>

<svelte:window bind:scrollY />

<header
	class:isMenuOpen
	id="global-header"
	class="gutter"
	class:hasBg
	class:pageHasHero={$pageHasHero}
	class:isScrolled
	{style}
>
	<div class="logo" class:hasArtist={isShowingArtistHeader}>
		<a href="/" class="baa">
			<BAALogo />
		</a>
	</div>
	{#if isShowingArtistHeader}
		<div class="artist-info gutter">
			{#if $currentProject}
				<a
					class="artist"
					href="/artists/{$currentArtist?.slug}/"
					in:fly|global={{ duration: 600, easing: cubicOut, x: '-40px', opacity: 0 }}
					out:fly|global={{ duration: 200, easing: linear, x: 0, opacity: 0 }}
				>
					{$currentArtist?.name}
				</a>
				<p
					class="project-name"
					in:fly|global={{ duration: 600, easing: cubicOut, x: '-40px', opacity: 0, delay: 80 }}
					out:fly|global={{ duration: 200, easing: linear, x: 0, opacity: 0 }}
				>
					{replaceArtist($currentProject.title)}
				</p>
			{:else}
				<div class="artist">{$currentArtist?.name}</div>
			{/if}
		</div>
	{/if}
	<div class="right">
		<button class="menu-btn" on:click={toggleMenu}>
			<div class="line line1" />
			<div class="line line2" />
		</button>
	</div>
</header>
<div id="mobile-nav" class="gutter" class:isMenuOpen style={mobileNavStyle}>
	{#if isMenuOpen}
		<div
			class="bg"
			in:fly={{
				opacity: 0,
				y: 0,
				x: 0,
				duration: 400,
				easing: sineInOut,
				delay: 0
			}}
			out:fly={{
				opacity: 0,
				y: 0,
				x: 0,
				duration: 600,
				easing: sineInOut,
				delay: 600
			}}
		/>
		<div class="wrap">
			<nav class="v-menu">
				{#each menuLinks as link, index (link.url)}
					<a
						href={link.url}
						in:fly|global={{
							duration: 1200,
							opacity: 0,
							y: 30,
							easing: expoOut,
							delay: index * 80
						}}
						out:fly|global={{
							duration: 400,
							opacity: 0,
							y: 0,
							easing: cubicIn,
							delay: index * 50
						}}
						class:active={link.isActive}>{link.name}</a
					>
					{#if link.children}
						<div class="subnav">
							{#each link.children as child, cIndex (child)}
								<a
									href={child.url}
									class:active={child.url === currentRoute}
									in:fly|global={{
										duration: 1200,
										opacity: 0,
										y: 15,
										easing: expoOut,
										delay: index * 80 + 150
									}}
									out:fly|global={{
										duration: 400,
										opacity: 0,
										y: 0,
										easing: cubicIn,
										delay: index * 50
									}}>{child.name}</a
								>
							{/each}
						</div>
					{/if}
				{/each}
			</nav>
			<footer>
				<div class="socials">
					{#each config.socials.links as link, index (link)}
						<a
							href={link.url}
							target="_blank"
							in:fly|global={{
								duration: 800,
								opacity: 0,
								x: 0,
								easing: cubicOut,
								delay: index * 50
							}}
							out:fly|global={{
								duration: 400,
								opacity: 0,
								x: 0,
								easing: cubicIn,
								delay: index * 50
							}}
						>
							<img src={link.icon} width="16" height="16" alt={link.name} />
							<span class="name">{link.name}</span>
						</a>
					{/each}
				</div>
				<div
					class="credits"
					in:fly|global={{
						duration: 800,
						opacity: 0,
						x: 0,
						y: 0,
						easing: sineInOut,
						delay: 300
					}}
					out:fly|global={{
						duration: 400,
						opacity: 0,
						x: 0,
						y: 0,
						easing: sineInOut
					}}
				>
					<p class="copyright">© {new Date().getFullYear()} BAA Global</p>
					<p class="tanka"><a href="https://tankadesign.com" target="_blank">Site by TANKA</a></p>
				</div>
			</footer>
		</div>
	{/if}
</div>

<style>
	header {
		--text-color: var(--text-light);
		--text-color-40: var(--text-light-40);
		--fade-height: 120px;
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: var(--top-nav-height);
		display: flex;
		justify-content: space-between;
		align-items: center;
		color: var(--text-color);
		z-index: var(--level10);
	}
	:global(.bg-is-light) header:not(.isMenuOpen):not(.pageHasHero) {
		--text-color: var(--text-dark);
		--text-color-40: var(--text-dark-40);
	}
	header:after,
	header:before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		z-index: -1;
		opacity: 0;
		transition: var(--bg-color-timing) var(--ease-in-out-sine);
		transition-property: opacity, background-color;
	}
	header:after {
		height: 100%;
		background: var(--bg-color);
		backdrop-filter: blur(14px);
		-webkit-backdrop-filter: blur(14px);
	}

	header.pageHasHero:not(.hasBg):not(.isMenuOpen):before {
		height: var(--fade-height);
		background: linear-gradient(to bottom, var(--bg-dark-45) 0%, transparent 100%);
		opacity: 1;
		pointer-events: none;
	}
	:global(.bg-is-light) header.pageHasHero.isScrolled:not(.hasBg):not(.isMenuOpen):before {
		background: transparent;
	}

	header.pageHasHero:after {
		background: var(--bg-dark-60);
	}
	:global(.bg-is-light) header.pageHasHero:after {
		background-color: var(--bg-light-60);
	}
	:global(.bg-is-light) header.pageHasHero.isScrolled {
		--text-color: var(--text-dark);
		--text-color-40: var(--text-dark-40);
	}
	header.hasBg:not(.isMenuOpen):after {
		opacity: 1;
	}
	.right {
		display: flex;
		align-items: center;
	}

	.menu-btn {
		display: block;
		position: relative;
		background: transparent;
		border: 1px solid var(--text-color-40);
		border-radius: 80px;
		width: 40px;
		height: 40px;
		cursor: pointer;
		transition: linear 180ms border-color;
	}

	.menu-btn .line {
		width: 16px;
		height: 2px;
		background: var(--text-color);
		transition: 220ms var(--ease-in-out-cubic) all;
		position: absolute;
		left: calc(50% - 8px);
		top: calc(50% - 1px);
	}
	:global(.bg-is-light) header:not(.pageHasHero) .menu-btn {
		border-color: var(--text-dark-40);
	}
	.menu-btn .line1 {
		transform: translateY(-3px);
	}
	.menu-btn .line2 {
		transform: translateY(3px);
	}
	header.isMenuOpen .menu-btn .line1 {
		transform: translateY(0) rotate(45deg);
	}
	header.isMenuOpen .menu-btn .line2 {
		transform: translateY(0) rotate(-45deg);
	}

	#mobile-nav {
		position: fixed;
		top: 0;
		left: 0;
		height: 100dvh;
		width: 100vw;
		z-index: var(--level9);
		pointer-events: none;
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 40px var(--gutter-sm);
	}
	#mobile-nav .bg {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 0;
		background: rgba(0, 0, 0, 0.9);
		backdrop-filter: blur(8px);
		-webkit-backdrop-filter: blur(8px);
	}

	:global(.bg-is-light) #mobile-nav .bg {
		background: var(--bg-light-90);
	}

	#mobile-nav.isMenuOpen {
		pointer-events: all;
		overflow-x: hidden;
		overflow-y: auto;
		overscroll-behavior: contain;
	}
	#mobile-nav .wrap {
		grid-column: 1 / span all;
		display: flex;
		flex-direction: column;
		position: relative;
		z-index: 1;
	}
	#mobile-nav .copyright {
		opacity: 0.4;
		margin: 0;
	}
	#mobile-nav footer {
		padding-bottom: 24px;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.v-menu {
		display: flex;
		flex-direction: column;
		gap: 40px;
		flex: 1;
		justify-content: center;
	}
	.v-menu a {
		font-size: var(--24pt);
		line-height: 1;
		color: var(--text-color);
		width: min-content;
		white-space: nowrap;
		text-transform: uppercase;
		font-weight: bold;
	}
	.v-menu a,
	.v-menu a:hover,
	.v-menu a:focus,
	.v-menu a:active {
		text-decoration: none;
	}

	.v-menu .subnav {
		width: 100%;
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 16px 8px;
	}
	.v-menu .subnav a {
		display: inline-block;
		white-space: nowrap;
		cursor: pointer;
		font-size: var(--14pt);
		line-height: var(--16pt);
		opacity: 0.6;
	}
	.v-menu .subnav a:hover,
	.v-menu .subnav a.active {
		opacity: 1;
	}

	.socials {
		display: flex;
		gap: 12px;
		transform: translateX(-8px);
	}
	.socials a {
		display: inline-flex;
		width: 32px;
		height: 32px;
		align-items: center;
		justify-content: center;
	}
	.socials .name {
		display: none;
	}
	:global(.bg-is-light) .socials a img {
		filter: invert(1);
	}
	.socials a img {
		width: 20px;
		height: 20px;
	}
	:global(.bg-is-light) .isMenuOpen {
		--text-color: var(--text-dark);
	}
	.logo {
		position: relative;
	}
	.logo a {
		position: relative;
		display: block;
	}
	.logo .baa {
		display: block;
		transition: linear opacity 180ms;
	}
	.logo.hasArtist .baa {
		opacity: 0;
	}
	.artist-info {
		position: absolute;
		top: 17px;
		left: 0;
		right: 60px;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		gap: 0;
	}
	.artist {
		text-transform: uppercase;
		font-size: var(--12pt);
		font-weight: bold;
		line-height: 1.12;
		white-space: nowrap;
		text-decoration: none;
		margin: 0;
	}
	.project-name {
		margin: 0;
		font-size: var(--20pt);
		line-height: 1.5;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		transform: translateY(-2px);
	}
	.credits {
		display: flex;
		gap: 16px;
		align-items: baseline;
		justify-content: center;
		font-size: var(--12pt);
	}
	.credits p {
		margin: 0;
		font-size: inherit;
	}
	.credits a {
		display: inline-block;
		transition: opacity 0.2s linear;
		transform: translateZ(0);
		text-decoration: none;
		font-size: inherit;
		opacity: 0.4;
	}
	.credits a:hover {
		opacity: 0.98;
	}

	@media (min-width: 720px) {
		header {
			--fade-height: 160px;
		}
		#mobile-nav .wrap {
			display: grid;
			grid-template-columns: repeat(12, 1fr);
			grid-column: 1 / span all;
			grid-template-rows: 1fr auto;
		}
		#mobile-nav footer {
			padding-bottom: 32px;
			grid-column: 1 / span all;
		}
		.v-menu {
			gap: 40px;
			align-items: start;
			grid-column: 2 / span 10;
		}
		.v-menu a {
			font-size: 1.75rem;
			line-height: 1;
			transition: opacity linear 150ms;
		}
		.v-menu a:hover {
			opacity: 0.6;
		}
		.v-menu .subnav {
			grid-template-columns: repeat(3, min-content);
			gap: 16px 40px;
		}
		.v-menu .subnav a {
			font-size: var(--16pt);
			line-height: var(--24pt);
		}
		.logo {
			display: flex;
			flex-direction: row;
			align-items: baseline;
		}
		.logo {
			gap: 16px;
			position: relative;
		}

		.artist-info {
			top: 25px;
		}
		.artist {
			font-size: var(--16pt);
		}
		.artist:hover {
			text-decoration: none;
		}
		.project-name {
			font-size: var(--36pt);
			font-weight: normal;
			transform: translateY(-4px);
		}
		.socials {
			gap: 48px;
			transform: none;
		}
		.socials a {
			width: auto;
			height: auto;
			display: inline-block;
		}
		.socials img {
			display: none;
		}
		.socials .name {
			display: inline-block;
		}
		#mobile-nav footer {
			display: flex;
			justify-content: space-between;
		}
		#mobile-nav .copyright {
			margin: 0;
		}
		.credits {
			gap: 32px;
			font-size: var(--14pt);
		}
	}
	@media (min-width: 960px) {
		.v-menu {
			grid-column: 3 / span 10;
		}
		.v-menu .subnav {
			grid-template-columns: repeat(4, min-content);
		}
	}
	@media (min-width: 1110px) {
		.v-menu .subnav {
			gap: 16px 80px;
		}
	}
</style>
