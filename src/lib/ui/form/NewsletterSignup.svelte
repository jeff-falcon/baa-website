<script lang="ts">
	import Validator, { type ValidationError } from 'fastest-validator';
	import TextField from '../input/TextField.svelte';
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';

	export let isOverLightBg = false;

	const v = new Validator();
	const check = v.compile({
		email: { type: 'email', label: 'Email address' }
	});

	let email: string = '';
	let wasEmailTested = false;
	let formResultMessage = '';
	let isSending = false;

	$: validation = check({ email });
	$: emailError =
		wasEmailTested &&
		validation !== true &&
		(validation as ValidationError[]).find((val) => val.field === 'email')
			? 'Invalid email address'
			: '';
	$: isValid = validation === true;

	function onEmailBlur(e: { detail: string }) {
		wasEmailTested = Boolean(e.detail.length);
	}

	function onUseForm(): ReturnType<SubmitFunction> {
		isSending = true;
		return async ({ result, update }) => {
			if (result.type === 'success' && result.data) {
				formResultMessage = result.data.message;
			} else {
				console.log('update', update);
			}
			isSending = false;
		};
	}
</script>

<div class="sign-up-form" class:isOverLightBg>
	<h3 class="title" class:isComplete={formResultMessage !== ''}>
		{#if formResultMessage}{formResultMessage}{:else}Sign Up For Our Newsletter{/if}
	</h3>
	<form method="POST" action="/forms/newsletter" use:enhance={onUseForm}>
		<TextField
			name="email"
			type="email"
			label="Your email"
			id="email"
			error={emailError}
			bind:value={email}
			on:blur={onEmailBlur}
			readonly={formResultMessage != ''}
			{isOverLightBg}
		/>
		<button type="submit" disabled={isSending || formResultMessage != '' || !isValid}
			>{isSending ? 'Subscribing...' : 'Sign Up'}</button
		>
	</form>
</div>

<style>
	form {
		display: flex;
		flex-direction: row;
		gap: 16px;
	}
	.isOverLightBg {
		--text-color: var(--text-dark);
		--text-color-60: var(--text-dark-60);
		--text-color-30: var(--text-dark-30);
		--text-color-5: var(--text-dark-5);
	}
	form :global(.textfield-container) {
		flex: 1;
		max-width: 440px;
	}
	button {
		padding-left: 24px;
		padding-right: 24px;
		flex: 0;
		white-space: nowrap;
		cursor: pointer;
		height: var(--button-height-large);
		border-radius: var(--input-border-radius);
		border: 1px solid var(--text-color);
		background: transparent;
		color: var(--text-color);
		transition: border-color 0.2s linear;
		display: block;
		width: 100%;
		font-weight: bold;
	}
	button:hover {
		border-color: var(--text-color);
	}
	button:disabled {
		border-color: var(--text-color-30);
		color: var(--text-color-30);
		cursor: default;
	}
	.title {
		font-weight: bold;
		text-transform: uppercase;
	}
	.title.isComplete {
		color: var(--text-highlight);
	}
	.isOverLightBg .title.isComplete {
		color: var(--text-color);
	}
	@media (min-width: 1024px) {
		.sign-up-form {
			gap: 24px;
		}
		button {
			padding-left: 40px;
			padding-right: 40px;
		}
	}
</style>
