"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
require('dotenv').config();
//@ts-ignore
const googleServiceAccountCreds = JSON.parse(Buffer.from(process.env.GOOGLE_CONFIG, 'base64').toString('ascii'));
if (!googleServiceAccountCreds)
    throw new Error('The $GOOGLE_SERVICE_ACCOUNT_CREDS environment variable was not found!');
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert(googleServiceAccountCreds),
});
exports.db = firebase_admin_1.default.firestore();
