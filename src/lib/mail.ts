import * as nodemailer from 'nodemailer'
import { GOOGLE_APP_EMAIL, GOOGLE_APP_PASSWORD } from '$env/static/private'
import { addRow } from './google-sheets'

export function sendMail(email: string, name: string, message: string, fields?: { [key: string]: string }, subject?: string) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: GOOGLE_APP_EMAIL,
      pass: GOOGLE_APP_PASSWORD,
    }
  })

  let html = `<p><b>New form submission from:</b><br/><span style="font-size: 1.5em; font-weight: bold;">${name} &lt;${email}&gt;</span></p><br/><br/><h3 style="font-size: 24px; line-height: 1.5em; margin-bottom: 0;">Message:</h3><hr style="border: 0; height: 3px; background: #999" /><p>${message}</p>`
  let text = `New form submission from:\n${name} <${email}>\n\nMessage:\n${message}\n`

  if (fields && Object.keys(fields).length > 0) {
    html += '<br/><br/><h3 style="font-size: 24px; line-height: 1.5em; margin-bottom: 0;">Fields:</h3><hr style="border: 0; height: 3px; background: #999" />'
    html += Object.entries(fields).map(([key, value]) => `<p><b>${key}:</b><br/><span style="font-size: 1.25em">${value}</span></p>`).join('')
    text += '\n------\n\nFields:\n------\n'
    text += Object.entries(fields).map(([key, value]) => `${key}: ${value}\n`).join('')
  }

  const promise1 = new Promise((resolve, reject) => {
    transporter.sendMail({ from: `Bespoke Digital <${GOOGLE_APP_EMAIL}>`, to: `Bespoke Digital <${GOOGLE_APP_EMAIL}>`, replyTo: `${name} <${email}>`, subject: subject ?? 'Form Submission', html, text }, (err, info) => {
      if (err) {
        reject(err)
        console.log({ err })
      } else {
        try {
          addRow(email, name, message, fields)
        } catch (err) {
          console.log('failed to add row to google sheet', err)
        }
        resolve(info)
        console.log({ info })
      }
    });
  })
  const promise2 = new Promise((resolve, reject) => {
    transporter.sendMail({ from: `Bespoke Digital <${GOOGLE_APP_EMAIL}>`, to: `${name} <${email}>`, subject: 'Receipt: ' + (subject ?? 'Form Submission'), html, text }, (err, info) => {
      if (err) {
        reject(err)
        console.log({ err })
      } else {
        try {
          addRow(email, name, message, fields)
        } catch (err) {
          console.log('failed to add row to google sheet', err)
        }
        resolve(info)
        console.log({ info })
      }
    });
  })

  return Promise.allSettled([promise1, promise2])
}