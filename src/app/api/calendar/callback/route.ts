// src/app/api/calendar/callback/route.ts
import { google } from 'googleapis';
import { NextResponse } from 'next/server';
import * as fs from 'fs/promises';
import * as path from 'path';
import { OAuth2Client } from 'google-auth-library';

const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'src/app/api/calendar/credentials.json');

async function getOAuth2Client(): Promise<OAuth2Client> {
  const content = await fs.readFile(CREDENTIALS_PATH, { encoding: 'utf-8' });
  const credentials = JSON.parse(content);
  const { client_secret, client_id, redirect_uris } = credentials.web;
  return new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  
  if (!code) {
    return NextResponse.json({ error: 'No code provided' }, { status: 400 });
  }
  
  try {
    const oAuth2Client = await getOAuth2Client();
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);
    // Save the token to TOKEN_PATH for later use
    await fs.writeFile(TOKEN_PATH, JSON.stringify(tokens));
    // Redirect back to your calendar page (adjust the URL if needed)
    return NextResponse.redirect(new URL('/cal', request.url));
  } catch (error) {
    console.error('Error during token exchange:', error);
    return NextResponse.json(
      { error: 'Failed to exchange token' },
      { status: 500 }
    );
  }
}
