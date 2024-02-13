import { MAILCHIMP_API_KEY, MAILCHIMP_API_URL, MAILCHIMP_AUDIENCE_ID } from '$env/static/private';
import { sendMail } from '$lib/mail';
import type { Actions } from '@sveltejs/kit';

export const actions: Actions = {
	default: async ({ request }): Promise<{ error?: string; message?: string }> => {
		const data = await request.formData();
		const email = data.get('email')?.toString().trim().toLowerCase();
		console.log('email', email);
		if (!email) return { error: 'Email is required' };

		try {
			const res = await fetch(`${MAILCHIMP_API_URL}/lists/${MAILCHIMP_AUDIENCE_ID}`, {
				method: 'POST',
				body: JSON.stringify({
					members: [
						{
							email_address: email,
							status: 'subscribed'
						}
					],
					update_existing: true
				}),
				headers: {
					Authorization: `auth ${MAILCHIMP_API_KEY}`
				}
			});
			if (res.ok) {
				sendMail(
					email,
					'',
					'Newsletter Signup completed. Email added to Mailchimp list.',
					{},
					'BAA Gloabl newsletter signup',
					false
				);
				return { message: `Thanks for signing up!` };
			} else {
				const json = await res.json();
				console.log('error sending to mailchimp', json);
				return { error: 'Something went wrong' };
			}
		} catch (err) {
			console.log('Newsletter signup error', err);
			return { error: (err as Error).message };
		}
	}
};
