import { google } from 'googleapis';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

const SCOPES = ['https://www.googleapis.com/auth/gmail.send'];
const CREDENTIALS_PATH = path.join(__dirname, 'credentials.json');
const TOKEN_PATH = path.join(__dirname, 'token.json');

// Load client secrets from a local file.
async function loadCredentials() {
    const content = await fs.promises.readFile(CREDENTIALS_PATH);
    return JSON.parse(content.toString());
}

// Authorize a client with credentials, returning an authorized client.
async function authorize() {
    const credentials = await loadCredentials();
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    // Check if we have previously stored a token.
    try {
        const token = await fs.promises.readFile(TOKEN_PATH);
        oAuth2Client.setCredentials(JSON.parse(token.toString()));
    } catch (error) {
        console.error('Token not found. Please authorize first.');
        throw error;
    }

    return oAuth2Client;
}

// Send an email using Gmail API
async function sendEmail(auth: any) {
    const gmail = google.gmail({ version: 'v1', auth });

    const mailOptions = {
        userId: 'me',
        requestBody: {
            raw: createEmail('recipient@example.com', 'Test Subject', 'This is a test email body.')
        }
    };

    try {
        const result = await gmail.users.messages.send(mailOptions);
        console.log('Email sent successfully:', result.data);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

// Create email in base64 format
function createEmail(to: string, subject: string, message: string) {
    const email = [
        `From: "Your Name" <your-email@gmail.com>`,
        `To: ${to}`,
        `Subject: ${subject}`,
        '',
        message,
    ].join('\n');

    return Buffer.from(email).toString('base64').replace(/\+/g, '-').replace(/\//g, '_');
}

// Main function to execute the script
async function main() {
    try {
        const auth = await authorize();
        await sendEmail(auth);
    } catch (error) {
        console.error('Error during execution:', error);
    }
}

main();