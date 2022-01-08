const admin = require("firebase-admin");
require('dotenv').config()

//@ts-ignore
const googleServiceAccountCreds = JSON.parse(Buffer.from(process.env.GOOGLE_CONFIG, 'base64').toString('ascii'))
if (!googleServiceAccountCreds) throw new Error('The $GOOGLE_SERVICE_ACCOUNT_CREDS environment variable was not found!');

admin.initializeApp({
  credential: admin.credential.cert(googleServiceAccountCreds),
})

export const db = admin.firestore()