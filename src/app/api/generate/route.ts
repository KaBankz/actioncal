/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { NextResponse } from "next/server";
import { z } from "zod";

// Schema for request validation
const generateRequestSchema = z.object({
  calendarData: z.object({
    events: z.array(
      z.object({
        title: z.string(),
        startTime: z.string(),
        endTime: z.string(),
        type: z.string().optional(),
        notes: z.string().optional(),
        location: z.string().optional(),
        flight: z
          .object({
            airline: z.string(),
            flightNumber: z.string(),
            departure: z.object({
              airport: z.string(),
              terminal: z.string(),
              gate: z.string(),
              time: z.string(),
            }),
            arrival: z.object({
              airport: z.string(),
              terminal: z.string(),
              gate: z.string(),
              time: z.string(),
            }),
            confirmationCode: z.string(),
            seatNumber: z.string(),
            boardingGroup: z.string(),
          })
          .optional(),
      }),
    ),
    preferences: z
      .object({
        focusHours: z.array(z.string()).optional(),
        breakPreferences: z
          .object({
            frequency: z.number(),
            duration: z.number(),
          })
          .optional(),
      })
      .optional(),
  }),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const { calendarData } = generateRequestSchema.parse(json);

    const prompt = `
      As an AI calendar assistant, analyze the following calendar data and generate UI components and recommendations.
      Calendar Events: ${JSON.stringify(calendarData.events, null, 2)}
      User Preferences: ${JSON.stringify(calendarData.preferences, null, 2)}

      Generate a response in the following JSON structure:
      {
        "layout": "focus",
        "components": [
          {
            "type": "string (e.g., FocusBlock, BreakSuggestion, MeetingPrep, TaskReminder)",
            "props": {
              "title": "string",
              "description": "string",
              "priority": "high" | "medium" | "low",
              "actionItems": ["string"],
              "relatedEventId": "string",
              "location": "string",
              "flight": {
                "airline": "string",
                "flightNumber": "string",
                "departure": {
                  "airport": "string",
                  "terminal": "string",
                  "gate": "string",
                  "time": "string"
                },
                "arrival": {
                  "airport": "string",
                  "terminal": "string",
                  "gate": "string",
                  "time": "string"
                },
                "confirmationCode": "string",
                "seatNumber": "string",
                "boardingGroup": "string"
              },
              "timeBlock": { "start": "string", "end": "string" }
            }
          }
        ],
        "suggestions": {
          "schedule_adjustments": ["string"],
          "focus_recommendations": ["string"],
          "meeting_preparations": ["string"]
        }
      }

      For each event with notes, provide specific components that help with:
      1. Pre-event preparation tasks
      2. During-event focus points
      3. Post-event action items
      4. Include the event's location if present

      When generating components, make sure to:
      1. Copy over the location field from the original event data
      2. Preserve all event metadata including location, time, and notes

      For focus time:
      1. Suggest specific time blocking strategies
      2. Recommend preparation steps
      3. Provide environment optimization tips

      For meetings:
      1. Create prep checklists based on meeting notes
      2. Suggest follow-up tasks
      3. Recommend time management strategies

      Provide detailed, context-aware recommendations based on the event notes and types.
    `;

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content:
                "You are an AI calendar assistant that analyzes schedules and generates UI components and recommendations to optimize productivity.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 2048,
          response_format: { type: "json_object" },
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }

    const completion = await response.json();
    const generatedUI = JSON.parse(
      completion.choices[0]?.message?.content || "{}",
    );

    return NextResponse.json(
      { success: true, data: generatedUI },
      { status: 200 },
    );
  } catch (error) {
    console.error("Generation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate UI components" },
      { status: 500 },
    );
  }
}
