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
        title: "Morning Planning",
        startTime: "2024-03-20T08:00:00",
        endTime: "2024-03-20T08:30:00",
        type: "focus",
        notes: "Review daily goals and prioritize tasks",
        reminder: {
          type: "planning",
          items: ["Check emails", "Review calendar", "Set top 3 priorities"],
          priority: "high",
        },
      },
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
        codebase: {
          repository: "github.com/company/project",
          branch: "feature/architecture-update",
          pullRequests: ["#123", "#124"],
          requiredReviews: 2,
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
        designReview: {
          files: ["Design System v2.fig", "Component Library.fig"],
          feedback: ["Color system", "Typography scale", "Spacing units"],
          tools: ["Figma", "Storybook"],
        },
      },
      {
        title: "Code Review & Documentation",
        startTime: "2024-03-20T14:00:00",
        endTime: "2024-03-20T16:00:00",
        type: "development",
        notes: "Review authentication service updates",
        development: {
          repository: "github.com/company/auth-service",
          pullRequest: "#789",
          reviewers: ["@alex", "@sarah", "@mike"],
          changes: ["OAuth flow", "JWT handling", "Rate limiting"],
          documentation: "docs/auth/v2-changes.md",
          testCoverage: "95%",
          deployment: {
            environment: "staging",
            version: "v2.3.0",
            rollback: "v2.2.9",
          },
        },
      },
      {
        title: "Evening Workout",
        startTime: "2024-03-20T17:30:00",
        endTime: "2024-03-20T18:30:00",
        type: "workout",
        notes: "High-intensity interval training",
        workout: {
          type: "HIIT",
          location: "Home Gym",
          equipment: ["Dumbbells", "Yoga mat", "Resistance bands"],
          exercises: [
            { name: "Burpees", sets: 3, reps: "45 seconds" },
            { name: "Mountain Climbers", sets: 3, reps: "45 seconds" },
            { name: "Kettlebell Swings", sets: 3, reps: "20" },
          ],
          training: {
            week: 4,
            goal: "Improve cardio",
            nextMilestone: "5k run",
          },
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
        title: "Morning Yoga",
        startTime: "2024-03-21T07:00:00",
        endTime: "2024-03-21T08:00:00",
        type: "workout",
        notes: "Vinyasa flow class",
        workout: {
          type: "yoga",
          instructor: "Sarah Chen",
          level: "Intermediate",
          style: "Vinyasa Flow",
          equipment: ["Yoga mat", "Blocks", "Strap"],
          location: "Zen Yoga Studio",
          room: "Studio 3",
        },
      },
      {
        title: "Team Breakfast",
        startTime: "2024-03-21T08:30:00",
        endTime: "2024-03-21T09:30:00",
        type: "social",
        notes: "Monthly team bonding",
        restaurant: {
          name: "The Breakfast Club",
          address: "123 Morning Ave, San Francisco",
          reservation: {
            time: "8:30 AM",
            confirmation: "BRK123",
            partySize: 8,
          },
          menu: "https://breakfast-club.com/menu",
          dietaryOptions: ["Vegetarian", "Gluten-free", "Vegan"],
          specialMenu: "Monthly Chef's Special",
        },
      },
      {
        title: "Product Strategy Workshop",
        startTime: "2024-03-21T10:00:00",
        endTime: "2024-03-21T12:00:00",
        type: "workshop",
        notes: "Q2 Planning and Roadmap",
        workshop: {
          materials: ["Q1 Report", "Market Analysis", "User Feedback"],
          prerequisites: ["Review Q1 OKRs", "Prepare team updates"],
          repository: "github.com/company/product-strategy",
          exercises: [
            "OKR Planning",
            "Feature Prioritization",
            "Resource Allocation",
          ],
          facilitator: "Alex Wong",
          room: "Innovation Lab",
          tools: ["Miro", "Notion", "Jira"],
        },
      },
      {
        title: "Client Presentation",
        startTime: "2024-03-21T14:00:00",
        endTime: "2024-03-21T15:00:00",
        type: "meeting",
        notes: "Present Q1 results",
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
      {
        title: "Team Retrospective",
        startTime: "2024-03-21T15:30:00",
        endTime: "2024-03-21T16:30:00",
        type: "virtual",
        notes: "Monthly team retrospective",
        videoCall: {
          platform: "Google Meet",
          link: "https://meet.google.com/abc-defg-hij",
          meetingId: "abc-defg-hij",
          passcode: "retro2024",
          joinBeforeHost: true,
        },
      },
      {
        title: "Design Review",
        startTime: "2024-03-21T16:30:00",
        endTime: "2024-03-21T17:30:00",
        type: "design",
        notes: "Review mobile app redesign",
        design: {
          project: "Mobile App Redesign",
          files: ["New Navigation.fig", "Onboarding Flow.fig"],
          tools: ["Figma", "Principle"],
          reviewers: ["Design Team", "Product Team"],
          deliverables: ["Navigation Specs", "Animation Guidelines"],
          prototype: "figma.com/prototype/456",
          research: {
            usability: "92% success rate",
            accessibility: "WCAG 2.1 AAA compliant",
          },
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
        title: "Morning Run",
        startTime: "2024-03-22T07:00:00",
        endTime: "2024-03-22T08:00:00",
        type: "workout",
        notes: "Training for half marathon",
        workout: {
          type: "running",
          route: "Marina Loop",
          distance: "5 miles",
          pace: "9:00 min/mile",
          location: "Marina District",
          equipment: ["Running shoes", "Fitness tracker"],
          weather: {
            temperature: "65°F",
            condition: "Clear",
            sunset: "6:45 PM",
          },
          training: {
            week: 6,
            goal: "Build endurance",
            nextMilestone: "10K race",
          },
        },
      },
      {
        title: "Dental Check-up",
        startTime: "2024-03-22T09:00:00",
        endTime: "2024-03-22T10:00:00",
        type: "health",
        notes: "Regular cleaning and check-up",
        medical: {
          doctor: "Dr. Emily Chen, DDS",
          specialty: "General Dentistry",
          clinic: "Bright Smile Dental",
          address: "456 Health Ave, San Francisco",
          floor: "5th Floor, Suite 502",
          insurance: "Delta Dental",
          documents: ["Insurance Card", "Dental History"],
          parking: "Validated parking in Main Garage",
          procedures: ["Cleaning", "X-rays", "Exam"],
          preAppointment: ["Brush teeth", "Floss"],
        },
      },
      {
        title: "Code Review Session",
        startTime: "2024-03-22T11:00:00",
        endTime: "2024-03-22T12:00:00",
        type: "development",
        notes: "Review new authentication system",
        development: {
          repository: "github.com/company/auth-service",
          pullRequest: "#456",
          reviewers: ["@sarah", "@mike", "@john"],
          changes: ["Auth flow", "API endpoints", "Tests"],
          documentation: "docs/auth/README.md",
          testCoverage: "98%",
          deployment: {
            environment: "staging",
            version: "v2.1.0",
            rollback: "v2.0.9",
          },
        },
      },
      {
        title: "Team Lunch",
        startTime: "2024-03-22T12:30:00",
        endTime: "2024-03-22T14:00:00",
        type: "social",
        notes: "Celebrating project milestone",
        restaurant: {
          name: "Pasta Paradise",
          address: "789 Italian Ave, San Francisco",
          reservation: {
            time: "12:30 PM",
            confirmation: "RES789",
            partySize: 10,
            table: "Private Room",
          },
          menu: "https://pasta-paradise.com/menu",
          dietaryOptions: ["Vegetarian", "Gluten-free", "Dairy-free"],
          specialRequests: "Birthday cake for Sarah",
          parking: "Valet available",
        },
      },
      {
        title: "Design Review",
        startTime: "2024-03-22T14:30:00",
        endTime: "2024-03-22T16:00:00",
        type: "design",
        notes: "Review new product features",
        design: {
          project: "Mobile App Redesign",
          files: ["UI Components.fig", "Design System.fig"],
          tools: ["Figma", "Principle"],
          reviewers: ["Product Team", "UX Team"],
          deliverables: ["Component Library", "Animation Specs"],
          prototype: "figma.com/prototype/123",
          research: {
            usability: "85% success rate",
            accessibility: "WCAG 2.1 AA compliant",
          },
        },
      },
      {
        title: "Team Sync",
        startTime: "2024-03-22T16:00:00",
        endTime: "2024-03-22T16:30:00",
        type: "virtual",
        notes: "Weekly team sync",
        videoCall: {
          platform: "Microsoft Teams",
          link: "https://teams.microsoft.com/l/123",
          meetingId: "123-456-789",
          passcode: "sync2024",
          joinBeforeHost: true,
        },
      },
      {
        title: "Evening Run",
        startTime: "2024-03-22T17:00:00",
        endTime: "2024-03-22T18:00:00",
        type: "workout",
        notes: "Training for half marathon",
        workout: {
          type: "running",
          route: "Marina Loop",
          distance: "5 miles",
          pace: "9:00 min/mile",
          location: "Marina District",
          equipment: ["Running shoes", "Fitness tracker"],
          weather: {
            temperature: "65°F",
            condition: "Clear",
            sunset: "6:45 PM",
          },
          training: {
            week: 6,
            goal: "Build endurance",
            nextMilestone: "10K race",
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
            className={`group relative overflow-hidden rounded-lg border p-4 transition-all duration-300 ${
              selectedSchedule === key
                ? "border-primary bg-primary/10 dark:border-primary/50 dark:bg-primary/20"
                : "border-border bg-card hover:border-primary/50 hover:bg-primary/5 dark:hover:border-primary/30 dark:hover:bg-primary/10"
            }`}
          >
            <div className="relative z-10">
              <h3
                className={`mb-2 font-semibold transition-colors ${
                  selectedSchedule === key
                    ? "text-primary dark:text-primary"
                    : "text-foreground group-hover:text-primary"
                }`}
              >
                {schedule.name}
              </h3>
              <p className="text-muted-foreground text-sm">
                {schedule.events.length} events scheduled
              </p>
            </div>
            <div
              className={`absolute inset-0 z-0 bg-gradient-to-br opacity-30 transition-opacity duration-300 ${
                selectedSchedule === key
                  ? "opacity-100"
                  : "opacity-0 group-hover:opacity-50"
              } ${
                key === "focusDay"
                  ? "from-violet-500/20 to-fuchsia-500/20 dark:from-violet-500/10 dark:to-fuchsia-500/10"
                  : key === "meetingDay"
                    ? "from-blue-500/20 to-cyan-500/20 dark:from-blue-500/10 dark:to-cyan-500/10"
                    : "from-emerald-500/20 to-teal-500/20 dark:from-emerald-500/10 dark:to-teal-500/10"
              }`}
            />
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
