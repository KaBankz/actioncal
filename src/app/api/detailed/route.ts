import { NextResponse } from "next/server";
import { z } from "zod";

const detailedRequestSchema = z.object({
  event: z.object({
    title: z.string(),
    startTime: z.string(),
    endTime: z.string(),
    description: z.string().optional(),
    notes: z.string().optional(),
    type: z.string().optional(),
  }),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const { event } = detailedRequestSchema.parse(json);

    const prompt = `
      You are an AI calendar assistant. Given the following event details, please provide detailed preparation notes. Include pre-event preparation tasks, key discussion points during the event, and suggested follow-up action items.
      
      Event Details:
      ${JSON.stringify(event, null, 2)}
      
      Please respond in plain text with a detailed and context-aware note.
    `;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mixtral-8x7b-32768",
        messages: [
          {
            role: "system",
            content: "You are a helpful AI assistant that provides detailed event preparation notes.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1024,
        response_format: { type: "text" },
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }

    const completion = await response.json();
    const detailedNotes = completion.choices[0]?.message?.content || "No details available.";

    return NextResponse.json({ success: true, data: detailedNotes }, { status: 200 });
  } catch (error) {
    console.error("Detailed notes generation error:", error);
    return NextResponse.json({ success: false, error: "Failed to generate detailed notes" }, { status: 500 });
  }
}
