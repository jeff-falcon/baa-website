import { MAILCHIMP_API_KEY, MAILCHIMP_API_URL, MAILCHIMP_AUDIENCE_ID } from '$env/static/private'
import type { Actions } from '@sveltejs/kit';

export const actions: Actions = {
  default: async ({ request }): Promise<{ error?: string, message?: string }> => {
    const data = await request.formData();
    const email = data.get('email');
    console.log('email', email);

    try {
      const res = await fetch(`${MAILCHIMP_API_URL}/lists/${MAILCHIMP_AUDIENCE_ID}`, {
        method: 'POST',
        body: JSON.stringify({
          members: [
            {
              email_address: email,
              status: 'subscribed',
            }
          ]
        }),
        headers: {
          Authorization: `auth ${MAILCHIMP_API_KEY}`,
        }
      })
      if (res.ok) {
        return { message: `Thanks for signing up!` }
      } else {
        const json = await res.json()
        console.log('error sending to mailchimp', json)
        return { error: 'Something went wrong' }
      }
    } catch (err) {
      console.log('Newsletter signup error', err);
      return { error: (err as Error).message }
    }
  }
};
