import { google } from 'googleapis';
import { NextResponse } from 'next/server';
import * as fs from 'fs/promises';
import * as path from 'path';
import { OAuth2Client } from 'google-auth-library';

const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'src/app/api/calendar/credentials.json');

async function getAuthClient(): Promise<OAuth2Client> {
  const content = await fs.readFile(CREDENTIALS_PATH, { encoding: 'utf-8' });
  const credentials = JSON.parse(content);
  const { client_secret, client_id } = credentials.installed;

  const oauth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    'http://localhost:3000/api/auth/callback'  // Make sure this matches your Google Cloud Console
  );

  try {
    const token = await fs.readFile(TOKEN_PATH, { encoding: 'utf-8' });
    oauth2Client.setCredentials(JSON.parse(token));
    return oauth2Client;
  } catch (err) {
    throw new Error('No token available - please authenticate first');
  }
}

export async function GET() {
  try {
    const auth = await getAuthClient();
    
    const calendar = google.calendar({ 
      version: 'v3', 
      auth
    });

    const res = await calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = res.data.items?.map(event => ({
      start: event.start?.dateTime || event.start?.date,
      summary: event.summary,
      id: event.id
    })) || [];

    return NextResponse.json({ events });
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    return NextResponse.json(
      { error: (error as Error).message }, 
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const content = await fs.readFile(CREDENTIALS_PATH, { encoding: 'utf-8' });
    const credentials = JSON.parse(content);
    const { client_secret, client_id } = credentials.installed;

    const oauth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      'http://localhost:3000/api/auth/callback'  // Make sure this matches your Google Cloud Console
    );

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
      include_granted_scopes: true
    });

    return NextResponse.json({ url: authUrl });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate auth URL' },
      { status: 500 }
    );
  }
}