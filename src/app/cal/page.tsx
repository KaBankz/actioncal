/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { useEffect, useState } from "react";
import { GeneratedCalendarView } from "@/components/sow-generated-calendar-view";

interface CalendarEvent {
  id: string;
  start: string;
  summary: string;
  description: string;
}

interface GeneratedEvent {
  title: string;
  startTime: string;
  endTime: string;
  type?: string;
  notes?: string;
  description?: string;
}

export default function CalendarPage() {
  const [fetchedEvents, setFetchedEvents] = useState<CalendarEvent[]>([]);
  const [generatedData, setGeneratedData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch calendar events on mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/calendar");
        const data = await response.json();
        if (data.error && data.error.includes("No token available")) {
          // If no token exists, trigger the auth flow
          const authResponse = await fetch("/api/calendar", { method: "POST" });
          const authData = await authResponse.json();
          if (authData.url) {
            window.location.href = authData.url;
            return;
          }
        } else if (data.error) {
          setError(data.error);
        } else {
          console.log(data);
          setFetchedEvents(data.events);
        }
      } catch (err) {
        setError("Failed to fetch calendar events");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Transform the fetched CalendarEvent objects to the format expected by the generator.
  const transformEvents = (
    calendarEvents: CalendarEvent[],
  ): GeneratedEvent[] => {
    return calendarEvents.map((event) => ({
      title: event.summary,
      startTime: event.start,
      endTime: event.start,
      description: event.description,
      type: undefined,
      notes: undefined,
    }));
  };

  // Trigger generation of the optimized schedule (including detailed notes and YouTube video recommendations).
  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const transformedEvents = transformEvents(fetchedEvents);
      const response = await fetch("/api/gen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          calendarData: { events: transformedEvents },
        }),
      });
      const data = await response.json();
      setGeneratedData(data.data);
    } catch (err) {
      console.error("Failed to generate components:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-8 text-3xl font-bold">Your Google Calendar</h1>
      {fetchedEvents.length === 0 ? (
        <p className="text-gray-500">No upcoming events found.</p>
      ) : (
        <>
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="mb-8 rounded-lg border p-4 hover:border-blue-300"
          >
            {isGenerating
              ? "Generating optimized schedule..."
              : "Generate Optimized Schedule"}
          </button>

          {generatedData ? (
            <GeneratedCalendarView
              calendarData={{ events: transformEvents(fetchedEvents) }}
              generatedComponents={generatedData}
            />
          ) : (
            <div className="space-y-4">
              {transformEvents(fetchedEvents).map((event, index) => (
                <div
                  key={index}
                  className="rounded-lg border p-4 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="font-semibold">{event.title}</div>
                  <div className="text-sm text-gray-500">
                    {new Date(event.startTime).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">
                    {event.description}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
