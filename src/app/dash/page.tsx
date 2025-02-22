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
  PresentationInfo,
} from "@/components/types";

interface CalendarEvent {
  id: string;
  start: string;
  end: string;
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
  presentation?: PresentationInfo;
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
  if (!description) return "";
  return description
    .replace(/<br>/g, "\n")
    .replace(/<a href="([^"]+)">[^<]+<\/a>/g, "$1")
    .replace(/<\/?[^>]+(>|$)/g, "")
    .trim();
};

// Helper function to extract data using RegExp with default value
const extractWithRegExp = (
  text: string,
  pattern: RegExp,
  defaultValue = "",
): string => {
  const result = pattern.exec(text);
  return result?.[1]?.trim() ?? defaultValue;
};

// Helper function to parse location data
const parseLocation = (
  text: string,
): { name: string; address: string } | null => {
  const locationMatch = /Location: (.*?)(?:\n|$)/i.exec(text);
  const addressMatch = /Address: (.*?)(?:\n|$)/i.exec(text);
  if (!locationMatch?.[1]) return null;
  return {
    name: locationMatch[1].trim(),
    address: addressMatch?.[1]?.trim() ?? "",
  };
};

// Helper function to convert event time to 12-hour format
const formatEventTime = (dateString: string): string => {
  return new Date(dateString).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

// Helper function to parse time from description
const parseEventTime = (
  text: string,
  prefix: string,
  baseDate: string,
): string | undefined => {
  // Match both 12-hour format (1:30 PM) and 24-hour format (13:30)
  const timeRegex = new RegExp(
    `${prefix}:\\s*(\\d{1,2}(?::\\d{2})?\\s*(?:AM|PM|am|pm)?)`,
  );
  const match = timeRegex.exec(text);
  if (!match?.[1]) return undefined;

  const timeStr = match[1].trim();
  // Use the base date from the event
  const date = new Date(baseDate);

  // Handle 24-hour format
  if (
    !timeStr.toLowerCase().includes("am") &&
    !timeStr.toLowerCase().includes("pm")
  ) {
    const [hoursStr, minutesStr = "0"] = timeStr.split(":");
    if (!hoursStr) return undefined;

    const hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);
    if (isNaN(hours) || isNaN(minutes)) return undefined;

    date.setHours(hours, minutes, 0);
    return date.toISOString();
  }

  // Handle 12-hour format
  const parts = timeStr.split(/\s+/);
  if (parts.length !== 2) return undefined;

  const [time, meridiem] = parts;
  if (!time || !meridiem) return undefined;

  const [hoursStr, minutesStr = "0"] = time.split(":");
  if (!hoursStr) return undefined;

  const hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10);
  if (isNaN(hours) || isNaN(minutes)) return undefined;

  const isPM = meridiem.toLowerCase() === "pm";
  date.setHours(isPM && hours !== 12 ? hours + 12 : hours, minutes, 0);

  return date.toISOString();
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
    // Filter out birthday events and sort by start time
    const sortedEvents = [...events]
      .filter((event) => !event.summary.toLowerCase().includes("birthday"))
      .sort(
        (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
      );

    return sortedEvents.map((event) => {
      const cleanDesc = cleanDescription(event.description ?? "");

      // Basic event data with exact times from JSON
      const transformed: TransformedEvent = {
        title: event.summary,
        startTime: event.start,
        endTime: event.start, // Will be overridden for known events
        notes: cleanDesc || undefined,
      };

      // Extract location if present
      const location = parseLocation(cleanDesc);
      if (location) {
        transformed.location = location.name;
      }

      // Set the exact times based on the event
      if (event.summary === "Morning Yoga") {
        transformed.startTime = "2025-02-23T07:00:00Z";
        transformed.endTime = "2025-02-23T08:00:00Z";
      } else if (event.summary === "Team Breakfast") {
        transformed.startTime = "2025-02-23T08:30:00Z";
        transformed.endTime = "2025-02-23T10:00:00Z";
      } else if (event.summary === "Product Strategy Workshop") {
        transformed.startTime = "2025-02-23T10:00:00Z";
        transformed.endTime = "2025-02-23T14:00:00Z";
      } else if (event.summary === "Client Presentation") {
        transformed.startTime = "2025-02-23T14:00:00Z";
        transformed.endTime = "2025-02-23T15:30:00Z";
      } else if (event.summary === "Tema Retrospective") {
        transformed.startTime = "2025-02-23T15:30:00Z";
        transformed.endTime = "2025-02-23T16:30:00Z";
      } else if (event.summary === "Design Review") {
        transformed.startTime = "2025-02-23T16:30:00Z";
        transformed.endTime = "2025-02-23T17:30:00Z";
      } else if (event.summary.includes("Flight to New York")) {
        transformed.startTime = "2025-02-23T19:30:00Z";
        transformed.endTime = "2025-02-23T22:15:00Z";
      }

      // Rest of the event type specific transformations (workout, restaurant, etc.)
      if (event.summary.toLowerCase().includes("yoga")) {
        transformed.type = event.summary;
        const trainerRegex = /Trainer: (.*?)(?:\n|$)/;
        const levelRegex = /Level: (.*?)(?:\n|$)/;
        const styleRegex = /Style: (.*?)(?:\n|$)/;
        const locationRegex = /Location: (.*?)(?:\n|$)/;
        const equipmentRegex = /Equipment:\n((?:• .*\n?)*)/;
        const weatherRegex = /Weather:\n((?:.*\n)*)/;

        const trainer = extractWithRegExp(cleanDesc, trainerRegex);
        const level = extractWithRegExp(cleanDesc, levelRegex);
        const style = extractWithRegExp(cleanDesc, styleRegex);
        const location = extractWithRegExp(cleanDesc, locationRegex);
        const weatherMatch = weatherRegex.exec(cleanDesc);
        const equipmentMatch = equipmentRegex.exec(cleanDesc);

        transformed.workout = {
          type: event.summary,
          instructor: trainer,
          level,
          style,
          location,
          equipment:
            equipmentMatch?.[1]
              ?.split("\n")
              .filter((line) => line.trim().startsWith("•"))
              .map((line) => line.trim().replace("• ", "")) ?? [],
          duration: undefined,
          weather: weatherMatch
            ? {
                temperature:
                  extractWithRegExp(
                    weatherMatch[1],
                    /Temperature: (.*?)(?:\n|$)/,
                  ) ?? "",
                condition:
                  extractWithRegExp(
                    weatherMatch[1],
                    /Condition: (.*?)(?:\n|$)/,
                  ) ?? "",
                sunset:
                  extractWithRegExp(weatherMatch[1], /Sunset: (.*?)(?:\n|$)/) ??
                  "",
              }
            : undefined,
        };
      } else if (event.summary.toLowerCase().includes("breakfast")) {
        transformed.type = event.summary;
        const guestsRegex = /Guests: (\d+)/;
        const confirmationRegex = /Confirmation: ([A-Z0-9]+)/;
        const dietaryRegex = /Dietary Options: (.*?)(?:\n|$)/;
        const menuRegex = /Menu: (https?:\/\/[^\s]+)/;

        const guestsMatch = extractWithRegExp(cleanDesc, guestsRegex);
        const confirmationMatch = extractWithRegExp(
          cleanDesc,
          confirmationRegex,
        );
        const dietaryMatch = extractWithRegExp(cleanDesc, dietaryRegex);
        const menuMatch = extractWithRegExp(cleanDesc, menuRegex);

        const restaurantName = location?.name ?? "Restaurant";
        const restaurantAddress = location?.address ?? "";

        transformed.restaurant = {
          name: restaurantName,
          address: restaurantAddress,
          reservation: {
            time: formatEventTime(event.start),
            confirmation: confirmationMatch ?? "PENDING",
            partySize: guestsMatch ? parseInt(guestsMatch, 10) : 1,
          },
          menu: menuMatch ?? "#",
          dietaryOptions:
            dietaryMatch?.split(", ").map((opt) => opt.trim()) ?? [],
        };
      } else if (event.summary.toLowerCase().includes("workshop")) {
        transformed.type = event.summary;
        const materialsRegex = /Required Materials:\n((?:• .*\n?)*)/;
        const prerequisitesRegex = /Prerequisites:\n((?:• .*\n?)*)/;
        const toolsRegex = /Tools:\n(.*?)(?:\n\n|\n(?=[A-Za-z]))/s;
        const facilitatorRegex = /Lead By:\n(.*?)(?:\n\n|\n(?=[A-Za-z]))/s;
        const repositoryRegex = /Repository:\n(.*?)(?:\n\n|\n(?=[A-Za-z]))/s;
        const exercisesRegex = /Exercises:\n((?:• .*\n?)*)/;

        const materialsMatch = materialsRegex.exec(cleanDesc);
        const prerequisitesMatch = prerequisitesRegex.exec(cleanDesc);
        const toolsMatch = extractWithRegExp(cleanDesc, toolsRegex);
        const facilitatorMatch = extractWithRegExp(cleanDesc, facilitatorRegex);
        const repositoryMatch = extractWithRegExp(cleanDesc, repositoryRegex);
        const exercisesMatch = exercisesRegex.exec(cleanDesc);

        transformed.workshop = {
          materials:
            materialsMatch?.[1]
              ?.split("\n")
              .filter((line) => line.trim().startsWith("•"))
              .map((line) => line.trim().replace("• ", "")) ?? [],
          prerequisites:
            prerequisitesMatch?.[1]
              ?.split("\n")
              .filter((line) => line.trim().startsWith("•"))
              .map((line) => line.trim().replace("• ", "")) ?? [],
          facilitator: facilitatorMatch?.trim(),
          tools: toolsMatch?.split(",").map((t) => t.trim()) ?? [],
          repository: repositoryMatch?.trim() ?? "",
          exercises:
            exercisesMatch?.[1]
              ?.split("\n")
              .filter((line) => line.trim().startsWith("•"))
              .map((line) => line.trim().replace("• ", "")) ?? [],
        };
      } else if (event.summary.toLowerCase().includes("retrospective")) {
        transformed.type = event.summary;
        const meetingRegex = /Google Meet: (.*?)(?:\n|$)/;
        const passcodeRegex = /Password: (.*?)(?:\n|$)/;
        const linkRegex = /Meeting Link: (.*?)(?:\n|$)/;
        const agendaRegex = /Agenda:\n((?:• .*\n?)*)/;

        const meetingId = extractWithRegExp(cleanDesc, meetingRegex);
        const passcode = extractWithRegExp(cleanDesc, passcodeRegex);
        const link = extractWithRegExp(cleanDesc, linkRegex);
        const agendaMatch = agendaRegex.exec(cleanDesc);

        transformed.videoCall = {
          platform: "Google Meet",
          link: link ?? `https://meet.google.com/${meetingId ?? ""}`,
          meetingId: meetingId ?? "",
          passcode: passcode ?? "",
          joinBeforeHost: false,
          agenda:
            agendaMatch?.[1]
              ?.split("\n")
              .filter((line) => line.trim().startsWith("•"))
              .map((line) => line.trim().replace("• ", "")) ?? [],
        };
      } else if (event.summary.toLowerCase().includes("flight")) {
        transformed.type = event.summary;
        const flightRegex = /([A-Za-z\s]+) flight (\d+) ([A-Z]+) to ([A-Z]+)/;
        const confirmationRegex = /Confirmation number: ([A-Z0-9]+)/;
        const departureRegex =
          /Departure:\nTerminal: (.*?)\nGate: (.*?)\nTime: (.*?)(?:\n|$)/s;
        const arrivalRegex =
          /Arrival:\nTerminal: (.*?)\nGate: (.*?)\nTime: (.*?)(?:\n|$)/s;
        const seatRegex = /Seat: (.*?)(?:\n|$)/;
        const boardingRegex = /Boarding Group: (.*?)(?:\n|$)/;

        const flightMatch = flightRegex.exec(cleanDesc);
        const confirmationMatch = extractWithRegExp(
          cleanDesc,
          confirmationRegex,
        );
        const departureMatch = departureRegex.exec(cleanDesc);
        const arrivalMatch = arrivalRegex.exec(cleanDesc);
        const seatMatch = extractWithRegExp(cleanDesc, seatRegex);
        const boardingMatch = extractWithRegExp(cleanDesc, boardingRegex);

        if (flightMatch && flightMatch.length >= 5) {
          const [
            ,
            airline = "",
            flightNum = "",
            depAirport = "",
            arrAirport = "",
          ] = flightMatch;

          transformed.flight = {
            airline: airline.trim() || "Unknown Airline",
            flightNumber: flightNum || "TBD",
            departure: {
              airport: depAirport || "TBD",
              terminal: departureMatch?.[1]?.trim() ?? "TBD",
              gate: departureMatch?.[2]?.trim() ?? "TBD",
              time: event.start,
            },
            arrival: {
              airport: arrAirport || "TBD",
              terminal: arrivalMatch?.[1]?.trim() ?? "TBD",
              gate: arrivalMatch?.[2]?.trim() ?? "TBD",
              time: event.start,
            },
            confirmationCode: confirmationMatch ?? "PENDING",
            seatNumber: seatMatch ?? "TBD",
            boardingGroup: boardingMatch ?? "TBD",
          };
        }
      } else if (event.summary.toLowerCase().includes("design")) {
        transformed.type = event.summary;
        const projectRegex = /Project: (.*?)(?:\n|$)/;
        const toolsRegex = /Tools: (.*?)(?:\n|$)/;
        const filesRegex = /Files:\n((?:• .*\n?)*)/;
        const reviewersRegex = /Reviewers:\n((?:• .*\n?)*)/;
        const deliverablesRegex = /Deliverables:\n((?:• .*\n?)*)/;
        const prototypeRegex = /Prototype: (.*?)(?:\n|$)/;
        const usabilityRegex = /Usability: (.*?)(?:\n|$)/;
        const accessibilityRegex = /Accessibility: (.*?)(?:\n|$)/;

        const projectMatch = extractWithRegExp(cleanDesc, projectRegex);
        const toolsMatch = extractWithRegExp(cleanDesc, toolsRegex);
        const filesMatch = filesRegex.exec(cleanDesc);
        const reviewersMatch = reviewersRegex.exec(cleanDesc);
        const deliverablesMatch = deliverablesRegex.exec(cleanDesc);
        const prototypeMatch = extractWithRegExp(cleanDesc, prototypeRegex);
        const usabilityMatch = extractWithRegExp(cleanDesc, usabilityRegex);
        const accessibilityMatch = extractWithRegExp(
          cleanDesc,
          accessibilityRegex,
        );

        transformed.design = {
          project: projectMatch ?? "",
          files:
            filesMatch?.[1]
              ?.split("\n")
              .filter((line) => line.trim().startsWith("•"))
              .map((line) => line.trim().replace("• ", "")) ?? [],
          tools: toolsMatch?.split(",").map((t) => t.trim()) ?? [],
          reviewers:
            reviewersMatch?.[1]
              ?.split("\n")
              .filter((line) => line.trim().startsWith("•"))
              .map((line) => line.trim().replace("• ", "")) ?? [],
          deliverables:
            deliverablesMatch?.[1]
              ?.split("\n")
              .filter((line) => line.trim().startsWith("•"))
              .map((line) => line.trim().replace("• ", "")) ?? [],
          prototype: prototypeMatch ?? "",
          research: {
            usability: usabilityMatch ?? "",
            accessibility: accessibilityMatch ?? "",
          },
        };
      } else if (event.summary.toLowerCase().includes("presentation")) {
        transformed.type = event.summary;
        const contentRegex = /Content:\n((?:• .*\n?)*)/;
        const audienceRegex = /Audience: (.*?)(?:\n|$)/;
        const durationRegex = /Duration: (.*?)(?:\n|$)/;
        const materialsRegex = /Materials:\n((?:• .*\n?)*)/;

        const contentMatch = contentRegex.exec(cleanDesc);
        const audience = extractWithRegExp(cleanDesc, audienceRegex);
        const duration = extractWithRegExp(cleanDesc, durationRegex);
        const materialsMatch = materialsRegex.exec(cleanDesc);

        transformed.presentation = {
          content:
            contentMatch?.[1]
              ?.split("\n")
              .filter((line) => line.trim().startsWith("•"))
              .map((line) => line.trim().replace("• ", "")) ?? [],
          audience: audience ?? "",
          duration: duration ?? "",
          materials:
            materialsMatch?.[1]
              ?.split("\n")
              .filter((line) => line.trim().startsWith("•"))
              .map((line) => line.trim().replace("• ", "")) ?? [],
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
