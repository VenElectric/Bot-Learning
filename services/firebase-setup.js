"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const admin = require("firebase-admin");
require('dotenv').config();
//@ts-ignore
const googleServiceAccountCreds = JSON.parse(Buffer.from(process.env.GOOGLE_CONFIG, 'base64').toString('ascii'));
if (!googleServiceAccountCreds)
    throw new Error('The $GOOGLE_SERVICE_ACCOUNT_CREDS environment variable was not found!');
admin.initializeApp({
    credential: admin.credential.cert(googleServiceAccountCreds),
});
exports.db = admin.firestore();
