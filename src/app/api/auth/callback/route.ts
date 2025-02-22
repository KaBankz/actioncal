import { google } from 'googleapis';
import { NextResponse } from 'next/server';
import * as fs from 'fs/promises';
import * as path from 'path';

const CREDENTIALS_PATH = path.join(process.cwd(), 'src/app/api/calendar/credentials.json');
const TOKEN_PATH = path.join(process.cwd(), 'token.json');

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json({ error: 'No code provided' }, { status: 400 });
    }

    const content = await fs.readFile(CREDENTIALS_PATH, { encoding: 'utf-8' });
    const credentials = JSON.parse(content);
    const { client_secret, client_id, redirect_uris } = credentials.installed;

    const oauth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      'http://localhost:3000/api/auth/callback'  // Make sure this matches your Google Cloud Console
    );

    const { tokens } = await oauth2Client.getToken(code);
    await fs.writeFile(TOKEN_PATH, JSON.stringify(tokens));

    // Redirect back to the calendar page
    return NextResponse.redirect(new URL('/cal', request.url));
  } catch (error) {
    console.error('Error handling callback:', error);
    return NextResponse.json({ error: 'Failed to handle authentication' }, { status: 500 });
  }
}