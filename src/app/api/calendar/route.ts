/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// src/app/api/calendar/route.ts
import { google } from "googleapis";
import { NextResponse } from "next/server";
import * as fs from "fs/promises";
import * as path from "path";
import { OAuth2Client } from "google-auth-library";

const SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];
// Token will be stored at the project root (adjust if needed)
const TOKEN_PATH = path.join(process.cwd(), "token.json");
// Your credentials file (ensure it uses "web" and contains the proper redirect URI)
const CREDENTIALS_PATH = path.join(
  process.cwd(),
  "src/app/api/calendar/credentials.json",
);

async function getAuthClient(): Promise<OAuth2Client> {
  // Read credentials file
  const content = await fs.readFile(CREDENTIALS_PATH, { encoding: "utf-8" });
  const credentials = JSON.parse(content);
  const { client_secret, client_id, redirect_uris } = credentials.web;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0], // should be "http://localhost:3000/oauth2callback"
  );

  // Try to load a previously stored token
  try {
    const token = await fs.readFile(TOKEN_PATH, { encoding: "utf-8" });
    oAuth2Client.setCredentials(JSON.parse(token));
    return oAuth2Client;
  } catch (err) {
    // No token found – signal to the client that authentication is needed
    throw new Error("No token available - please authenticate first");
  }
}

export async function GET() {
  try {
    const auth = await getAuthClient();
    const calendar = google.calendar({ version: "v3", auth });
    const res = await calendar.events.list({
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: "startTime",
    });
    const events =
      res.data.items?.map((event) => ({
        id: event.id,
        start: event.start?.dateTime ?? event.start?.date,
        summary: event.summary,
        description: event.description,
      })) ?? [];
    return NextResponse.json({ events });
  } catch (error) {
    console.error("Error fetching calendar events:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}

export async function POST() {
  try {
    // Read credentials file
    const content = await fs.readFile(CREDENTIALS_PATH, { encoding: "utf-8" });
    const credentials = JSON.parse(content);
    const { client_secret, client_id, redirect_uris } = credentials.web;
    const oAuth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0],
    );
    // Generate the auth URL for the OAuth consent screen
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: SCOPES,
    });
    return NextResponse.json({ url: authUrl });
  } catch (error) {
    console.error("Error generating auth URL:", error);
    return NextResponse.json(
      { error: "Failed to generate auth URL" },
      { status: 500 },
    );
  }
}
