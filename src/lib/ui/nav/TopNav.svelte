<script lang="ts">
	import { page, navigating } from '$app/stores';
	import { isMenuOpenComplete, menuState, pageHasHero, bgColor } from '$lib/store';
	import type { Config } from '$lib/types';
	import BAALogo from '$lib/ui/logos/BAALogo.svelte';
	import InstagramLogo from '$lib/ui/logos/InstagramLogo.svelte';

	import anime from 'animejs';
	import { cubicIn, cubicOut, expoOut, linear, sineInOut } from 'svelte/easing';
	import { fade, fly } from 'svelte/transition';

	export let usePillFollower = true;
	export let config: Config;

	let isBorderAnimating = false;
	let scrollY = 0;
	let changeBgTimeout = 0;
	let hasBg = false;

	let borderEl: HTMLDivElement;
	let linkElements: { [key: string]: HTMLAnchorElement } = {};
	let fromToAnim = { from: { x: 0, width: 0 }, to: { x: 0, width: 0 } };
	let currentLinkHover: HTMLAnchorElement | null = null;
	let hoverTimeout = 0;
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

	$: if ($pageHasHero) {
		clearTimeout(changeBgTimeout);
		hasBg = scrollY > 120;
	} else {
		clearTimeout(changeBgTimeout);
		if (typeof window !== 'undefined') {
			changeBgTimeout = window.setTimeout(() => {
				hasBg = true;
			}, 150);
		}
	}

	$: menuLinks = [
		{
			name: 'Artists',
			url: '/',
			isActive: currentRoute === '/'
		},
		{
			name: 'Info',
			url: '/about/',
			isActive: (currentRoute.indexOf('/about') ?? -1) > -1
		}
	];

	$: currentRoute = $page.url.pathname ?? '';
	$: isMenuOpen = $menuState === 'open';
	$: isOverCurrent = currentLinkHover?.getAttribute('href') === currentRoute;
	$: mobileNavStyle = $bgColor ? `--bg-color: ${$bgColor};` : '';
	$: isOverLightSolid = false;

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
	function removeBorder() {
		clearTimeout(hoverTimeout);
		currentLinkHover = null;
		isBorderAnimating = false;
	}
	function mouseOut(e: MouseEvent) {
		clearTimeout(hoverTimeout);
		hoverTimeout = window.setTimeout(() => {
			if (!isOverCurrent) {
				const prevLink = menuLinks.find((link) => link.isActive);
				if (prevLink) {
					drawBorder(prevLink.url, true);
				} else {
					anime({
						targets: borderEl,
						opacity: 0,
						duration: 300,
						easing: 'easeInOutSine'
					});
				}
			}
		}, 350);
	}
	function drawBorder(url: string, removeOnComplete = false) {
		clearTimeout(hoverTimeout);
		hoverTimeout = window.setTimeout(() => {
			let prevLink = menuLinks.find((link) => link.isActive)?.url;
			if (currentLinkHover) {
				prevLink = currentLinkHover.getAttribute('href') ?? undefined;
			}
			if (!prevLink) prevLink = url;
			if (prevLink && usePillFollower) {
				isBorderAnimating = true;
				const fromEl = linkElements[prevLink];
				const toEl = linkElements[url];
				const fromBox = fromEl.getBoundingClientRect();
				const toBox = toEl.getBoundingClientRect();
				const left = Math.min(fromBox.left, toBox.left);
				const right = Math.max(fromBox.right, toBox.right);
				currentLinkHover = toEl;
				anime({
					targets: borderEl,
					opacity: 1,
					duration: 300,
					easing: 'easeInOutSine'
				});
				anime({
					targets: borderEl,
					keyframes: [
						{
							duration: 0,
							left: `${fromBox.left}px`,
							width: `${fromBox.width}px`,
							easing: 'easeOutCubic'
						},
						{
							duration: 220,
							left: `${left}px`,
							width: `${right - left}px`,
							easing: 'easeOutCubic'
						},
						{
							duration: 300,
							left: `${toBox.left}px`,
							width: `${toBox.width}px`,
							easing: 'easeOutCubic'
						}
					],
					complete: () => {
						if (removeOnComplete) {
							currentLinkHover = null;
							isBorderAnimating = false;
						}
					}
				});
			}
		}, 150);
	}
</script>

<svelte:window bind:scrollY />

<header
	class:isMenuOpen
	class:isOverLightSolid
	id="global-header"
	class="gutter"
	class:hasBg
	{style}
>
	<div class="logo">
		<a href="/">
			<BAALogo />
		</a>
	</div>
	<div class="right">
		<button class="menu-btn" on:click={toggleMenu}>
			<div class="line line1" />
			<div class="line line2" />
		</button>
	</div>
</header>
<div id="mobile-nav" class:isMenuOpen style={mobileNavStyle}>
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
								x: 10,
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
					<p class="copyright">© {new Date().getFullYear()} Bespoke Digital</p>
				</div>
			</footer>
		</div>
	{/if}
</div>

<style>
	header {
		--text-color: var(--text-light);
		--text-color-40: var(--text-light-40);
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
	header.isOverLightSolid {
		--text-color: var(--text-dark);
		--text-color-40: var(--text-dark-40);
	}
	header:after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: -1;
		opacity: 0;
		transition: var(--bg-color-timing) var(--ease-in-out-sine);
		transition-property: opacity, background-color;
		background: rgba(38, 38, 38, 0.6);
		backdrop-filter: blur(14px);
		-webkit-backdrop-filter: blur(14px);
	}
	header.hasBg:after {
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
	.menu-btn {
		border-color: var(--text-color);
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
		width: 100dvw;
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
		background: var(--bg-color);
	}

	#mobile-nav.isMenuOpen {
		pointer-events: all;
		overflow-x: hidden;
		overflow-y: auto;
		overscroll-behavior: contain;
	}
	#mobile-nav .wrap {
		grid-column: 3 / span 2;
		display: flex;
		flex-direction: column;
		position: relative;
		z-index: 1;
	}
	#mobile-nav .copyright {
		font-size: var(--12pt);
		opacity: 0.4;
		margin: 24px 0 0;
	}
	#mobile-nav footer {
		padding-bottom: 40px;
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
	}
	.v-menu a:hover,
	.v-menu a:focus,
	.v-menu a:active {
		text-decoration: none;
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
	.bg-is-light .socials a {
		filter: invert(1);
	}
</style>
