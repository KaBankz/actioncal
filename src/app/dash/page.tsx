/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";
import { useState, useEffect } from "react";
import { GeneratedCalendarView } from "@/components/generated-calendar-view";
import type {
  VideoCallInfo,
  WorkoutInfo,
  WorkshopInfo,
  RestaurantInfo,
  DesignInfo,
} from "@/components/types";

interface CalendarEvent {
  id: string;
  start: string;
  summary: string;
  description?: string;
}

interface TransformedEvent {
  title: string;
  startTime: string;
  endTime: string;
  type?: string;
  notes?: string;
  location?: string;
  videoCall?: VideoCallInfo;
  workout?: WorkoutInfo;
  workshop?: WorkshopInfo;
  restaurant?: RestaurantInfo;
  design?: DesignInfo;
  flight?: {
    airline: string;
    flightNumber: string;
    departure: {
      airport: string;
      terminal: string;
      gate: string;
      time: string;
    };
    arrival: {
      airport: string;
      terminal: string;
      gate: string;
      time: string;
    };
    confirmationCode: string;
    seatNumber: string;
    boardingGroup: string;
  };
}

interface GeneratedData {
  layout: string;
  components: Array<{
    type: string;
    props: Record<string, unknown>;
  }>;
  suggestions: {
    schedule_adjustments: string[];
    focus_recommendations: string[];
    meeting_preparations: string[];
  };
}

interface CalendarResponse {
  error?: string;
  events?: CalendarEvent[];
  url?: string;
}

// Helper function to clean HTML from description
const cleanDescription = (description?: string) => {
  return description?.replace(/<\/?[^>]+(>|$)/g, "") ?? "";
};

// Helper function to extract data using RegExp
const extractWithRegExp = (
  text: string,
  pattern: RegExp,
): string | undefined => {
  const result = pattern.exec(text);
  return result?.[1];
};

export default function DashboardPage() {
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [generatedData, setGeneratedData] = useState<GeneratedData | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCalendarData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/calendar");
        const data = (await response.json()) as CalendarResponse;

        if (data.error?.includes("No token available")) {
          const authResponse = await fetch("/api/calendar", { method: "POST" });
          const authData = (await authResponse.json()) as CalendarResponse;
          if (authData.url) {
            window.location.href = authData.url;
            return;
          }
        } else if (data.error) {
          setError(data.error);
        } else if (data.events) {
          // Filter out events that are too far in the future (like yearly birthday reminders)
          const relevantEvents = data.events.filter((event: CalendarEvent) => {
            const eventDate = new Date(event.start);
            const oneYearFromNow = new Date();
            oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
            return eventDate < oneYearFromNow;
          });
          setCalendarEvents(relevantEvents);
          await generateComponents(relevantEvents);
        }
      } catch (err) {
        console.error("Failed to fetch calendar events:", err);
        setError("Failed to fetch calendar events");
      } finally {
        setIsLoading(false);
      }
    };

    void fetchCalendarData();
  }, []);

  const transformEvents = (events: CalendarEvent[]): TransformedEvent[] => {
    return events.map((event) => {
      const cleanDesc = cleanDescription(event.description);
      const transformed: TransformedEvent = {
        title: event.summary,
        startTime: event.start,
        endTime: event.start, // Since we don't have end time in the data
        notes: cleanDesc,
      };

      // Determine event type and add specific properties based on the event
      if (event.summary.toLowerCase().includes("yoga")) {
        transformed.type = "workout";
        const trainerRegex = /Trainer: (.*?)(?:\n|$)/;
        const instructor = extractWithRegExp(cleanDesc, trainerRegex);

        transformed.workout = {
          type: "yoga",
          instructor: instructor ?? undefined,
          level: "Intermediate",
          style: "Vinyasa Flow",
          location: "Zen Yoga Studio",
          equipment: ["Yoga mat", "Blocks", "Strap"],
        };
      } else if (event.summary.toLowerCase().includes("breakfast")) {
        transformed.type = "social";
        const guestsRegex = /Guests: (\d+)/;
        const confirmationRegex = /Confirmation: ([A-Z0-9]+)/;
        const dietaryRegex = /Dietary Options: (.*?)(?:\n|$)/;

        const guestsMatch = extractWithRegExp(cleanDesc, guestsRegex);
        const confirmationMatch = extractWithRegExp(
          cleanDesc,
          confirmationRegex,
        );
        const dietaryMatch = extractWithRegExp(cleanDesc, dietaryRegex);

        transformed.restaurant = {
          name: "The Breakfast Club",
          address: "123 Morning Ave, San Francisco",
          reservation: {
            time: "8:30 AM",
            confirmation: confirmationMatch ?? "BRK123",
            partySize: guestsMatch ? parseInt(guestsMatch, 10) : 8,
          },
          menu: "https://breakfast-club.com/menu",
          dietaryOptions: dietaryMatch?.split(", ") ?? [
            "Vegetarian",
            "Gluten-free",
            "Vegan",
          ],
        };
      } else if (event.summary.toLowerCase().includes("workshop")) {
        transformed.type = "workshop";
        const materialsRegex =
          /Required Materials(.*?)(?=Prerequisites|\n\n|$)/s;
        const prerequisitesRegex = /Prerequisites(.*?)(?=\n\n|$)/s;
        const toolsRegex = /Tools: (.*?)(?:\n|$)/;
        const facilitatorRegex = /Lead By: (.*?)(?:\n|$)/;

        const materialsMatch = extractWithRegExp(cleanDesc, materialsRegex);
        const prerequisitesMatch = extractWithRegExp(
          cleanDesc,
          prerequisitesRegex,
        );
        const toolsMatch = extractWithRegExp(cleanDesc, toolsRegex);
        const facilitatorMatch = extractWithRegExp(cleanDesc, facilitatorRegex);

        transformed.workshop = {
          materials:
            materialsMatch?.match(/• (.*)/g)?.map((m) => m.replace("• ", "")) ??
            [],
          prerequisites:
            prerequisitesMatch
              ?.match(/• (.*)/g)
              ?.map((m) => m.replace("• ", "")) ?? [],
          facilitator: facilitatorMatch ?? "Unknown",
          tools: toolsMatch?.split(", ").map((t) => t.trim()) ?? [],
          repository: "github.com/company/workshop",
          exercises: [
            "OKR Planning",
            "Feature Prioritization",
            "Resource Allocation",
          ],
        };
      } else if (event.summary.toLowerCase().includes("retrospective")) {
        transformed.type = "virtual";
        const meetingRegex = /Google Meet: (.*?)(?:\n|$)/;
        const passcodeRegex = /Password: (.*?)(?:\n|$)/;

        const meetingId = extractWithRegExp(cleanDesc, meetingRegex) ?? "";
        const passcode = extractWithRegExp(cleanDesc, passcodeRegex) ?? "";

        transformed.videoCall = {
          platform: "Google Meet",
          link: `https://meet.google.com/${meetingId}`,
          meetingId,
          passcode,
          joinBeforeHost: true,
        };
      } else if (event.summary.toLowerCase().includes("flight")) {
        transformed.type = "flight";
        const flightRegex = /([A-Za-z\s]+) flight (\d+).*?([A-Z]+).*?([A-Z]+)/;
        const confirmationRegex = /Confirmation number: ([A-Z0-9]+)/;

        const flightMatch = flightRegex.exec(cleanDesc);
        const confirmationMatch = confirmationRegex.exec(cleanDesc);

        if (flightMatch && confirmationMatch) {
          const [
            ,
            airline = "Spirit",
            flightNumber = "552",
            departureAirport = "CMH",
            arrivalAirport = "LGA",
          ] = flightMatch;
          const [, confirmationCode = "EP2M3H"] = confirmationMatch;

          transformed.flight = {
            airline: airline.trim(),
            flightNumber,
            departure: {
              airport: departureAirport,
              terminal: "1",
              gate: "A1",
              time: event.start,
            },
            arrival: {
              airport: arrivalAirport,
              terminal: "2",
              gate: "B2",
              time: event.start,
            },
            confirmationCode,
            seatNumber: "12A",
            boardingGroup: "2",
          };
        }
      } else if (event.summary.toLowerCase().includes("design")) {
        transformed.type = "design";
        const toolsRegex = /Tools: (.*?)(?:\n|$)/;
        const toolsMatch = extractWithRegExp(cleanDesc, toolsRegex);

        transformed.design = {
          project: "Mobile App Redesign",
          files: ["New Navigation.fig", "Onboarding Flow.fig"],
          tools: toolsMatch?.split(", ").map((t) => t.trim()) ?? [
            "Figma",
            "Principle",
          ],
          reviewers: ["Design Team", "Product Team"],
          deliverables: ["Navigation Specs", "Animation Guidelines"],
          prototype: "figma.com/prototype/456",
          research: {
            usability: "92% success rate",
            accessibility: "WCAG 2.1 AAA compliant",
          },
        };
      }

      return transformed;
    });
  };

  const generateComponents = async (events: CalendarEvent[]) => {
    try {
      const transformedEvents = transformEvents(events);
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          calendarData: {
            events: transformedEvents,
          },
        }),
      });

      const data = await response.json();
      setGeneratedData(data.data as GeneratedData);
    } catch (error) {
      console.error("Failed to generate components:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="py-8 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-2">Loading your calendar...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-8 text-3xl font-bold">Your AI-Optimized Calendar</h1>

      {calendarEvents.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-gray-700">
          <p>No upcoming events found in your calendar.</p>
        </div>
      ) : (
        generatedData && (
          <GeneratedCalendarView
            calendarData={{
              events: transformEvents(calendarEvents),
            }}
            generatedComponents={generatedData}
          />
        )
      )}
    </div>
  );
}
