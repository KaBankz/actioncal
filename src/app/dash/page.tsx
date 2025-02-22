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
        reminder: {
          type: "productivity",
          items: [
            "Review PRs before starting",
            "Update architecture diagrams",
            "Document decisions",
          ],
          priority: "high",
        },
      },
      {
        title: "Virtual Coffee Chat with Design Team",
        startTime: "2024-03-20T13:00:00",
        endTime: "2024-03-20T13:30:00",
        type: "virtual",
        notes: "Discuss new design system",
        videoCall: {
          platform: "Zoom",
          link: "https://zoom.us/j/123456789",
          meetingId: "123 456 789",
          passcode: "coffee",
          joinBeforeHost: true,
        },
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
        title: "Gym Session",
        startTime: "2024-03-21T07:00:00",
        endTime: "2024-03-21T08:30:00",
        type: "workout",
        notes: "Upper body day",
        workout: {
          type: "strength",
          exercises: [
            { name: "Bench Press", sets: 3, reps: "8-10" },
            { name: "Pull-ups", sets: 4, reps: "6-8" },
            { name: "Shoulder Press", sets: 3, reps: "10-12" },
          ],
          location: "24 Hour Fitness - Downtown",
          trainer: "Alex Smith",
        },
      },
      {
        title: "Team Lunch",
        startTime: "2024-03-21T12:00:00",
        endTime: "2024-03-21T13:30:00",
        type: "social",
        notes: "Monthly team bonding",
        restaurant: {
          name: "Sushi Paradise",
          address: "789 Food Street, San Francisco",
          reservation: {
            time: "12:00 PM",
            confirmation: "RES123",
            partySize: 8,
          },
          menu: "https://sushi-paradise.com/menu",
          dietaryOptions: ["Vegetarian", "Gluten-free"],
        },
      },
      {
        title: "Client Presentation",
        startTime: "2024-03-21T14:00:00",
        endTime: "2024-03-21T15:00:00",
        type: "meeting",
        notes: "Present Q1 results, discuss next quarter goals",
        location: "Client HQ - 123 Business Ave, San Francisco",
        flight: {
          airline: "United Airlines",
          flightNumber: "UA 1234",
          departure: {
            airport: "JFK",
            terminal: "4",
            gate: "B12",
            time: "2024-03-21T08:00:00",
          },
          arrival: {
            airport: "SFO",
            terminal: "2",
            gate: "C45",
            time: "2024-03-21T11:30:00",
          },
          confirmationCode: "ABC123",
          seatNumber: "12A",
          boardingGroup: "2",
        },
        presentation: {
          file: "Q1_Results_2024.pptx",
          slides: 15,
          duration: "45 mins",
          sharedWith: ["client@company.com", "team@ourcompany.com"],
          requiredMaterials: ["Projector", "Handouts"],
        },
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
        title: "Doctor's Appointment",
        startTime: "2024-03-22T09:00:00",
        endTime: "2024-03-22T10:00:00",
        type: "health",
        notes: "Annual check-up",
        medical: {
          doctor: "Dr. Sarah Johnson",
          specialty: "General Practitioner",
          clinic: "Bay Area Medical Center",
          address: "456 Health Ave, San Francisco",
          floor: "3rd Floor, Suite 302",
          insurance: "Blue Cross",
          documents: ["Insurance Card", "Medical History"],
          parking: "Validated parking available in Structure B",
        },
      },
      {
        title: "Team Workshop",
        startTime: "2024-03-22T11:00:00",
        endTime: "2024-03-22T12:00:00",
        type: "meeting",
        notes: "Technical workshop on new testing framework",
        location: "Conference Room A - 456 Tech Street, San Francisco",
        workshop: {
          materials: ["Laptop", "Testing Documentation"],
          prerequisites: ["Install Node.js", "Clone workshop repo"],
          repository: "github.com/company/testing-workshop",
          exercises: [
            "Basic test setup",
            "Writing first test",
            "Mocking examples",
          ],
        },
      },
      {
        title: "Family Dinner",
        startTime: "2024-03-22T18:00:00",
        endTime: "2024-03-22T20:00:00",
        type: "personal",
        notes: "Mom's birthday celebration",
        social: {
          occasion: "Birthday Celebration",
          location: "Home - 789 Family Lane",
          guests: 8,
          gifts: ["Birthday Card", "Flowers"],
          food: {
            menu: ["Lasagna", "Caesar Salad", "Birthday Cake"],
            dietary: ["Vegetarian option available"],
            responsibilities: "Bring dessert",
          },
        },
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
