import * as nodemailer from 'nodemailer';
import { GOOGLE_APP_EMAIL, GOOGLE_APP_PASSWORD } from '$env/static/private';

function createHtmlBody(
	name: string,
	email: string,
	message: string,
	fields?: { [key: string]: string },
	isExternal = false
) {
	let body = `<p style="margin: 0 0 10px"><img src="https://baa-global.com/baa-logo-dark.png" width="72" height="30" alt="BAA Global"  /></p>
  <h3 style="font-size: 16px; line-height: 1.5em; margin: 0 0 50px; font-weight: normal;">${
		isExternal ? 'Receipt of your inquiry' : 'New website submission'
	}</h3>
  <h3 style="font-size: 24px; line-height: 1.5em; margin: 0; font-weight: normal;">From</h3>
  <p style="font-size: 16px; line-height: 1.33em; margin: 8px 0 30px;">${name} - ${email}</p>
  <h3 style="font-size: 24px; line-height: 1.5em; margin: 0; font-weight: normal;">Message</h3>
  <p style="font-size: 16px; line-height: 1.33em; margin: 8px 0 30px; max-width: 600px;">${message}</p>`;

	let text = `New form submission from:\n${name} <${email}>\n\nMessage:\n${message}\n`;

	if (fields && Object.keys(fields).length > 0) {
		body += `<br/><br/>
      <h3 style="font-size: 24px; line-height: 1.5em; margin: 0; font-weight: normal;">Fields</h3>`;
		body += Object.entries(fields)
			.map(
				([key, value]) =>
					`<p style="font-size: 16px; line-height: 1.33em; margin: 8px 0 20px;"><b style="font-size: 14px;">${key}:</b><br/>
          ${value}
          </p>`
			)
			.join('');
		text += '\n------\n\nFields:\n------\n';
		text += Object.entries(fields)
			.map(([key, value]) => `${key}: ${value}\n`)
			.join('');
	}

	const html = `<html>
  <head>
  <style>
    @font-face {
      font-family: 'bespoke-digital-web';
      src: url('https://bespokedigital.com/fonts/2466765/9b1d752a-575e-4d49-9cb7-db3223777f47.woff2') format('woff2'),
        url('https://bespokedigital.com/fonts/2466765/b9eb9968-39c3-4d2d-882a-302cf860e114.woff') format('woff');
      font-weight: bold;
      font-style: normal;
    }
    @font-face {
      font-family: 'bespoke-digital-web';
      src: url('https://bespokedigital.com/fonts/2466777/2792b279-5b1b-47b6-839f-5bc9163b442c.woff2') format('woff2'),
        url('https://bespokedigital.com/fonts/2466777/ae29d4a4-5f5c-4a66-b4fe-55286a973389.woff') format('woff');
      font-weight: normal;
      font-style: normal;
    }
  </style>
  </head>
  <body style="font-family: bespoke-digital-web, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
  Cantarell, 'Open Sans', 'Helvetica Neue', Arial, sans-serif;">${body}</body>
  </html>`;

	return { html, text };
}

export function sendMail(
	email: string,
	name: string,
	message: string,
	fields?: { [key: string]: string },
	subject?: string,
	sendReceipt = true
) {
	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: GOOGLE_APP_EMAIL,
			pass: GOOGLE_APP_PASSWORD
		}
	});

	const bespokeEmail = `Bespoke Digital <${GOOGLE_APP_EMAIL}>`;

	const promise1 = new Promise((resolve, reject) => {
		const { html, text } = createHtmlBody(name, email, message, fields);
		transporter.sendMail(
			{
				from: bespokeEmail,
				to: bespokeEmail,
				replyTo: `${name} <${email}>`,
				subject: subject ?? 'Form Submission',
				html,
				text
			},
			(err, info) => {
				if (err) {
					reject(err);
					console.log({ err });
				} else {
					resolve(info);
					console.log({ info });
				}
			}
		);
	});
	const promise2 = new Promise((resolve, reject) => {
		if (!sendReceipt) return resolve({});
		const { html, text } = createHtmlBody(name, email, message, fields, true);
		transporter.sendMail(
			{
				from: bespokeEmail,
				to: `${name} <${email}>`,
				subject: 'Receipt: ' + (subject ?? 'Form Submission'),
				html,
				text
			},
			(err, info) => {
				if (err) {
					reject(err);
					console.log({ err });
				} else {					
					resolve(info);
					console.log({ info });
				}
			}
		);
	});

	return Promise.allSettled([promise1, promise2]);
}
