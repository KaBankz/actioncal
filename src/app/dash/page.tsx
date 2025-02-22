/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";
import { useState } from "react";
import { GeneratedCalendarView } from "@/components/generated-calendar-view";

// Multiple mock schedules for different scenarios
const mockSchedules = {
  focusDay: {
    name: "Focus-Heavy Day",
    events: [
      {
        title: "Deep Work: Project Architecture",
        startTime: "2024-03-20T09:00:00",
        endTime: "2024-03-20T12:00:00",
        type: "focus",
        notes: "Review system architecture, plan microservices structure",
      },
      {
        title: "Quick Team Sync",
        startTime: "2024-03-20T13:00:00",
        endTime: "2024-03-20T13:30:00",
        type: "meeting",
        notes: "Status update on backend integration",
      },
    ],
    preferences: {
      focusHours: ["09:00", "10:00", "11:00", "14:00", "15:00"],
      breakPreferences: { frequency: 90, duration: 15 },
    },
  },
  meetingDay: {
    name: "Meeting-Heavy Day",
    events: [
      {
        title: "Sprint Planning",
        startTime: "2024-03-21T10:00:00",
        endTime: "2024-03-21T11:30:00",
        type: "meeting",
        notes: "Review backlog, assign tasks, discuss blockers",
      },
      {
        title: "Client Presentation",
        startTime: "2024-03-21T14:00:00",
        endTime: "2024-03-21T15:00:00",
        type: "meeting",
        notes: "Present Q1 results, discuss next quarter goals",
      },
    ],
    preferences: {
      focusHours: ["09:00", "12:00", "16:00"],
      breakPreferences: { frequency: 120, duration: 15 },
    },
  },
  mixedDay: {
    name: "Balanced Day",
    events: [
      {
        title: "Code Review",
        startTime: "2024-03-22T09:00:00",
        endTime: "2024-03-22T10:00:00",
        type: "focus",
        notes: "Review PR #123 - Authentication flow updates",
      },
      {
        title: "Team Workshop",
        startTime: "2024-03-22T11:00:00",
        endTime: "2024-03-22T12:00:00",
        type: "meeting",
        notes: "Technical workshop on new testing framework",
      },
    ],
    preferences: {
      focusHours: ["09:00", "14:00", "15:00", "16:00"],
      breakPreferences: { frequency: 90, duration: 15 },
    },
  },
};

export default function DashboardPage() {
  const [selectedSchedule, setSelectedSchedule] = useState<string | null>(null);
  const [generatedData, setGeneratedData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const generateComponents = async (scheduleKey: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          calendarData:
            mockSchedules[scheduleKey as keyof typeof mockSchedules],
        }),
      });

      const data = await response.json();
      setGeneratedData(data.data);
      setSelectedSchedule(scheduleKey);
    } catch (error) {
      console.error("Failed to generate components:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-8 text-3xl font-bold">Your AI-Optimized Calendar</h1>

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        {Object.entries(mockSchedules).map(([key, schedule]) => (
          <button
            key={key}
            onClick={() => generateComponents(key)}
            className={`rounded-lg border p-4 ${
              selectedSchedule === key
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-blue-300"
            }`}
          >
            <h3 className="mb-2 font-semibold">{schedule.name}</h3>
            <p className="text-sm text-gray-600">
              {schedule.events.length} events scheduled
            </p>
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="py-8 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-2">Generating optimized schedule...</p>
        </div>
      )}

      {!isLoading && selectedSchedule && generatedData && (
        <GeneratedCalendarView
          calendarData={
            mockSchedules[selectedSchedule as keyof typeof mockSchedules]
          }
          generatedComponents={generatedData}
        />
      )}
    </div>
  );
}
