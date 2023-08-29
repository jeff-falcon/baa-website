<script lang="ts">
	import ArrowIcon from './ArrowIcon.svelte';

	export let title: string = '';
	export let isTitleHiddenOnMobile = false;
	export let isTitleBefore = true;
	export let href = '';
	export let isOverSolid = true;
	export let style: 'capsule' | 'default' = 'default';

	$: sanitizedHref = href.replace(/^http(s):\/\/(.*?)bespokedigital\.com/, '') ?? '';
	$: isLinkExternal = sanitizedHref.startsWith('http');
	$: titleSplits = title.split(' ');
</script>

{#if href}
	<a
		{href}
		target={isLinkExternal ? '_blank' : null}
		class="btn"
		class:hasTitle={Boolean(title)}
		class:isTitleHiddenOnMobile
		class:isTitleBefore
		class:isOverSolid
		class:isCapsule={style === 'capsule'}
	>
		{#if title}
			<span class="title"
				>{#each titleSplits as word}
					<span class="word">{word}</span>
				{/each}</span
			>
		{/if}
		<ArrowIcon isBordered={style === 'default'} />
	</a>
{:else}
	<button
		on:click
		type="button"
		class="btn"
		class:hasTitle={Boolean(title)}
		class:isTitleHiddenOnMobile
		class:isTitleBefore
		class:isOverSolid
		class:isCapsule={style === 'capsule'}
	>
		{#if title}
			<span class="title"
				>{#each titleSplits as word}
					<span class="word">{word}</span>
				{/each}</span
			>
		{/if}
		<ArrowIcon isBordered={style === 'default'} />
	</button>
{/if}

<style>
	.btn {
		background: transparent;
		cursor: pointer;
		display: flex;
		align-items: center;
		padding: 0;
		border: 0;
		gap: var(--14pt);
		color: var(--text-color);
		text-decoration: none;
	}
	a:hover {
		text-decoration: none;
	}
	.title {
		font-size: var(--14pt);
		line-height: var(--24pt);
		order: 2;
	}
	.isTitleBefore .title {
		order: 1;
	}
	.isTitleBefore :global(.icon) {
		order: 2;
	}
	.isOverSolid .title {
		opacity: 0.6;
		transition: opacity 180ms linear;
	}
	.btn:hover .title {
		opacity: 1;
	}
	.isTitleHiddenOnMobile .title {
		display: none;
	}
	.title .word {
		display: none;
	}
	.title .word:nth-child(1),
	.title .word:nth-child(2) {
		display: inline;
	}
	.isCapsule {
		border-radius: var(--input-border-radius);
		border: 1px solid var(--text-color-30);
		padding: 0 32px;
		height: 48px;
		transition: border-color 180ms linear;
	}
	.isCapsule .title {
		opacity: 1;
	}
	.isCapsule:hover {
		border-color: var(--text-color);
	}
	@media (min-width: 560px) {
		button {
			gap: var(--18pt);
		}
		.title {
			font-size: var(--16pt);
			line-height: var(--24pt);
		}
		.isTitleHiddenOnMobile .title {
			display: block;
		}
		.title .word {
			display: inline;
		}
	}
</style>
