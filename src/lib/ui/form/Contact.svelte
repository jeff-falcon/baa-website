<script lang="ts">
	import Validator, { type ValidationError } from 'fastest-validator';
	import TextField from '../input/TextField.svelte';
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import TextArea from '../input/TextArea.svelte';

	export let mode: 'long' | 'short' = 'short';

	const v = new Validator();
	const check = v.compile({
		email: { type: 'email', normalize: true, label: 'Email address' },
		name: { type: 'string', label: 'Your name', min: 1, trim: true },
		message: { type: 'string', label: 'Message', trim: true, min: 10, max: 5000 }
	});

	let email: string = '';
	let name: string = '';
	let message: string = '';
	let company: string = '';
	let phone: string = '';
	let isSending = false;
	let wasEmailTested = false;
	let wasNameTested = false;
	let wasMessageTested = false;
	let formResultMessage = '';

	$: validation = check({ email, name, message });
	$: emailError =
		wasEmailTested &&
		validation !== true &&
		(validation as ValidationError[]).find((val) => val.field === 'email')
			? 'Invalid email address'
			: '';
	$: nameError =
		wasNameTested &&
		validation !== true &&
		(validation as ValidationError[]).find((val) => val.field === 'name')
			? 'Name is required'
			: '';
	$: messageError =
		wasMessageTested && validation !== true
			? (validation as ValidationError[]).find((val) => val.field === 'message')?.message ?? ''
			: '';
	$: isValid = validation === true;

	function onEmailBlur(e: { detail: string }) {
		if (email.length) {
			wasEmailTested = true;
		}
	}
	function onNameBlur(e: { detail: string }) {
		if (name.length) {
			wasNameTested = true;
		}
	}
	function onMessageBlur(e: { detail: string }) {
		if (message.length) {
			wasMessageTested = true;
		}
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

<div class="contact-form {mode}">
	{#if formResultMessage}
		<h3 class="title" class:isComplete={true}>
			{formResultMessage}
		</h3>
	{:else}
		{#if mode === 'short'}
			<h3 class="title">Get In Touch</h3>
		{/if}
		<form method="POST" action="/forms/contact" use:enhance={onUseForm}>
			<input type="hidden" name="type" value="contact" />
			<div class="message">
				<TextArea
					name="message"
					label="Tell us about your project"
					id="message"
					bind:value={message}
					error={messageError}
					on:blur={onMessageBlur}
				/>
			</div>
			<div class="name-email">
				<TextField
					name="name"
					type="text"
					label="Your name"
					id="name"
					error={nameError}
					bind:value={name}
					on:blur={onNameBlur}
				/>
				<TextField
					name="email"
					type="email"
					label="Your email"
					id="email"
					error={emailError}
					bind:value={email}
					on:blur={onEmailBlur}
				/>
			</div>
			{#if mode === 'long'}
				<div class="company-phone">
					<TextField
						name="company"
						type="text"
						label="Your company"
						id="company"
						bind:value={company}
					/>
					<TextField name="phone" type="text" label="Your phone" id="phone" bind:value={phone} />
				</div>
			{/if}
			<button type="submit" disabled={isSending || formResultMessage != '' || !isValid}
				>{isSending ? 'Sending...' : 'Send'}</button
			>
		</form>
	{/if}
</div>

<style>
	form {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}
	.title {
		font-weight: bold;
	}
	.title.isComplete {
		color: var(--text-highlight);
	}
	:global(.bg-is-light) .title.isComplete {
		color: var(--text-color);
	}
	.name-email {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}
	.company-phone {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}
	button {
		margin-top: 8px;
	}
	@media (min-width: 720px) {
		form {
			display: grid;
		}
		.short form {
			grid-template-areas: 'message message' 'name-email submit';
		}
		.short button {
			margin-top: 0;
		}
		.long form {
			grid-template-areas:
				'message'
				'name-email'
				'company-phone'
				'submit';
		}
		.message {
			grid-area: message;
		}
		.email {
			grid-area: email;
		}
		.message :global(.textarea-container),
		.message :global(.textarea) {
			min-height: 80px;
		}
		.name-email {
			flex-direction: row;
			grid-area: name-email;
		}
		.company-phone {
			flex-direction: row;
			grid-area: company-phone;
		}
		.long :global(.textfield-container) {
			width: 100%;
			max-width: 100%;
		}
		.short .name-email :global(.textfield-container),
		.short .company-phone :global(.textfield-container) {
			width: 100%;
			max-width: 248px;
		}
		.short button {
			grid-area: submit;
			width: max-content;
			padding-left: 40px;
			padding-right: 40px;
			justify-self: end;
		}
	}
</style>
