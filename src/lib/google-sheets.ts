import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library'
import { GOOGLE_CREDENTIALS_CLIENT_EMAIL, GOOGLE_CREDENTIALS_PRIVATE_KEY, GOOGLE_SPREADSHEET_DOC_ID } from '$env/static/private'

const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive.file',
];

const jwtFromEnv = new JWT({
  email: GOOGLE_CREDENTIALS_CLIENT_EMAIL,
  key: GOOGLE_CREDENTIALS_PRIVATE_KEY.replace(/\\n/g, "\n"),
  scopes: SCOPES,
});

const doc = new GoogleSpreadsheet(GOOGLE_SPREADSHEET_DOC_ID, jwtFromEnv);

export async function addRow(email: string, name: string, message: string, fields?: { [key: string]: string }) {
  await doc.loadInfo();

  if (doc.sheetCount === 1) {
    await doc.addSheet({ title: 'bespokedigital', headerValues: ['timestamp', 'name', 'email', 'message', 'company', 'phone', 'portfolio'] });
  }

  const sheet = doc.sheetsByIndex[1];

  await sheet.getRows();

  if (sheet.rowCount > 0) {
    await sheet.loadHeaderRow();
    console.log('header row loaded')

  }
  if (sheet.rowCount === 0 || sheet.headerValues.length === 0) {
    console.log('setting header row')
    await sheet.setHeaderRow(['timestamp', 'name', 'email', 'message', 'company', 'phone', 'portfolio'])
    console.log('set header row')
  }

  const timestamp = new Date().toISOString();

  await sheet.addRow(
    { timestamp, name, email, message, ...(fields ?? {}) }
  );

}