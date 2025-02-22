import { z } from "zod";
import { NextResponse } from "next/server";

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
        description: z.string().optional(),
      })
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

    // Extract descriptions from the events (if any)
    const eventDescriptions = calendarData.events
      .map((event) => event.notes)
      .filter(Boolean);

    const prompt = `
      As an AI calendar assistant, analyze the following calendar data and generate UI components and recommendations.
      Calendar Events: ${JSON.stringify(calendarData.events, null, 2)}
      User Preferences: ${JSON.stringify(calendarData.preferences, null, 2)}
      Event Descriptions: ${JSON.stringify(eventDescriptions, null, 2)}

      Generate a response in the following JSON structure:
      {
        "layout": "focus",
        "components": [
          {
            "type": "string (e.g., FocusBlock, BreakSuggestion, MeetingPrep, TaskReminder)",
            "props": {
              "title": "string",
              "description": "string",
              "detailedNotes": "string",  // in-depth preparation and follow-up notes
              "priority": "high" | "medium" | "low",
              "actionItems": ["string"],
              "relatedEventId": "string",
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
      1. Pre-event preparation tasks (include detailed instructions on how to prepare)
      2. During-event focus points (include detailed suggestions for staying focused)
      3. Post-event action items (include detailed follow-up steps)

      For focus time:
      1. Suggest specific time blocking strategies with detailed notes
      2. Recommend preparation steps with in-depth context
      3. Provide environment optimization tips with detailed notes

      For meetings:
      1. Create prep checklists based on meeting notes and include detailed preparatory notes
      2. Suggest follow-up tasks with comprehensive details
      3. Recommend time management strategies with detailed insights

     Using the description, generate highly detailed and context-aware recommendations based on the event name, date, description, event notes, and event type. Ensure recommendations are specific and actionable, covering logistics, scheduling, required materials, attendee engagement, contingency planning, and any potential challenges unique to the event. Avoid vague or generic suggestions—each recommendation should be directly applicable to the event's details.
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
          model: "deepseek-r1-distill-qwen-32b",
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
      }
    );

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }

    const completion = await response.json();
    const generatedUI = JSON.parse(
      completion.choices[0]?.message?.content || "{}"
    );

    // For each generated component, fetch top 3 YouTube videos to assist with preparation.
    if (generatedUI.components && Array.isArray(generatedUI.components)) {
      await Promise.all(
        generatedUI.components.map(async (component: any) => {
          // Build a search query based on the component title and "preparation tips"
          const searchQuery = `${component.props.title} preparation tips`;
          const ytUrl = `https://serpapi.com/search.json?engine=youtube&search_query=${encodeURIComponent(
            searchQuery
          )}&api_key=${process.env.SERP_API_KEY}`;
          try {
            const ytResponse = await fetch(ytUrl);
            if (ytResponse.ok) {
              const ytData = await ytResponse.json();
              const videos = (ytData.video_results || [])
                .slice(0, 3)
                .map((video: any) => ({
                  title: video.title,
                  link: video.link,
                  thumbnail:
                    (video.thumbnail && video.thumbnail.static) ||
                    video.thumbnail ||
                    "",
                }));
              // Attach the video results to the component props
              component.props.youtubeVideos = videos;
            } else {
              component.props.youtubeVideos = [];
            }
          } catch (error) {
            console.error("YouTube API error:", error);
            component.props.youtubeVideos = [];
          }
        })
      );
    }

    return NextResponse.json(
      { success: true, data: generatedUI },
      { status: 200 }
    );
  } catch (error) {
    console.error("Generation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate UI components" },
      { status: 500 }
    );
  }
}
