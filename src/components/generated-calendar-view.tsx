/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { motion } from "framer-motion";
import {
  VideoCallDialog,
  WorkoutDialog,
  RestaurantDialog,
  MedicalDialog,
  DevelopmentDialog,
  DesignDialog,
  WorkshopDialog,
} from "./event-dialogs";
import type {
  VideoCallInfo,
  WorkoutInfo,
  RestaurantInfo,
  MedicalInfo,
  PresentationInfo,
  WorkshopInfo,
  SocialInfo,
  CodebaseInfo,
  DesignReviewInfo,
  DevelopmentInfo,
  DesignInfo,
} from "./types";

// Update the existing interface
interface GeneratedUIProps {
  calendarData: {
    events: Array<{
      title: string;
      startTime: string;
      endTime: string;
      type?: string;
      notes?: string;
      location?: string;
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
      videoCall?: VideoCallInfo;
      workout?: WorkoutInfo;
      restaurant?: RestaurantInfo;
      presentation?: PresentationInfo;
      medical?: MedicalInfo;
      workshop?: WorkshopInfo;
      social?: SocialInfo;
      codebase?: CodebaseInfo;
      designReview?: DesignReviewInfo;
      development?: DevelopmentInfo;
      design?: DesignInfo;
      reminder?: {
        type: string;
        items: string[];
        priority: string;
      };
    }>;
    preferences?: {
      focusHours?: string[];
      breakPreferences?: {
        frequency: number;
        duration: number;
      };
    };
  };
  generatedComponents: {
    layout: string;
    components: Array<{
      type: string;
      props: Record<string, any>;
    }>;
    suggestions: {
      schedule_adjustments: string[];
      focus_recommendations: string[];
      meeting_preparations: string[];
    };
  };
}

export function GeneratedCalendarView({
  calendarData,
  generatedComponents,
}: GeneratedUIProps) {
  if (!generatedComponents) {
    return null;
  }

  // Sort events by start time
  const sortedEvents = [...calendarData.events].sort((a, b) => {
    return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
  });

  // Helper function to format time
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="grid grid-cols-12 gap-8 p-8">
      {/* Timeline Column */}
      <div className="col-span-4 lg:col-span-3">
        <div className="sticky top-6">
          <h2 className="text-foreground mb-8 text-3xl font-bold tracking-tight">
            Today's Schedule
          </h2>
          <div className="relative space-y-6">
            {/* Timeline line */}
            <div className="bg-border/30 dark:bg-border/20 absolute left-[19px] top-0 h-full w-[2px] rounded-full"></div>
            {sortedEvents.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border-border bg-card hover:border-primary/50 dark:hover:shadow-primary/5 relative rounded-xl border p-4 shadow-sm transition-all duration-300 hover:shadow-md dark:shadow-none dark:hover:shadow-lg"
              >
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className="text-muted-foreground relative z-10 text-sm font-medium">
                      {formatTime(event.startTime)}
                    </div>
                    <div className="bg-border/30 dark:bg-border/20 my-2 h-full w-[2px] rounded-full"></div>
                    <div className="text-muted-foreground relative z-10 text-sm font-medium">
                      {formatTime(event.endTime)}
                    </div>
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="text-card-foreground text-base font-semibold">
                      {event.title}
                    </div>
                    <div className="text-muted-foreground mt-1 text-sm">
                      {event.notes}
                    </div>
                    {event.location && (
                      <div className="text-muted-foreground mt-2 flex items-center gap-2 text-sm">
                        <div className="bg-background/80 flex h-6 w-6 items-center justify-center rounded-full">
                          📍
                        </div>
                        {event.location}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="col-span-8 lg:col-span-9">
        <div className="grid auto-rows-[180px] grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Event Cards */}
          {sortedEvents.map((event, index) => {
            // Weather cards
            if (event.location && !event.flight && !event.restaurant) {
              return (
                <motion.div
                  key={`weather-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="h-full">
                    <WeatherComponent location={event.location} />
                  </div>
                </motion.div>
              );
            }

            return (
              <motion.div
                key={`event-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={event.flight ? "lg:col-span-2" : undefined}
              >
                <div className="h-full">{RenderEventCard({ event })}</div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Update QuickActionButton
function QuickActionButton({
  event,
}: {
  event: GeneratedUIProps["calendarData"]["events"][0];
}) {
  const getActionButton = () => {
    if (event.videoCall) {
      return (
        <a
          href={event.videoCall.link}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-primary/10 text-primary hover:bg-primary/20 dark:hover:bg-primary/15 flex w-full items-center justify-between rounded-lg px-4 py-2 text-sm font-medium"
        >
          <span>Join {event.videoCall.platform}</span>
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </a>
      );
    }
    if (event.workout) {
      return (
        <button className="bg-primary/10 text-primary hover:bg-primary/20 dark:hover:bg-primary/15 flex w-full items-center justify-between rounded-lg px-4 py-2 text-sm font-medium">
          <span>Start Workout</span>
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </button>
      );
    }
    return null;
  };

  return getActionButton();
}

// Video Call Card Component
function VideoCallCard({ videoCall }: { videoCall: VideoCallInfo }) {
  return (
    <div className="relative flex h-[180px] flex-col overflow-hidden rounded-xl bg-gradient-to-br from-blue-400/10 via-blue-500/10 to-blue-600/10 p-4 shadow-sm transition-all duration-300 hover:shadow-md dark:from-blue-400/5 dark:via-blue-500/5 dark:to-blue-600/5 dark:hover:shadow-blue-500/5">
      <div className="bg-grid-slate-100 dark:bg-grid-slate-700/25 absolute inset-0 [mask-image:linear-gradient(0deg,transparent,black)]"></div>
      <div className="relative flex flex-1 flex-col">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10 dark:bg-blue-400/10">
              <svg
                className="h-4 w-4 text-blue-500 dark:text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div className="text-foreground font-medium">
              {videoCall.platform}
            </div>
          </div>
          <div className="inline-flex h-5 items-center whitespace-nowrap rounded-full bg-blue-500/10 px-2 text-xs font-medium text-blue-500 dark:bg-blue-400/10 dark:text-blue-400">
            Now
          </div>
        </div>

        <div className="text-muted-foreground mb-4 text-sm">
          Meeting ID: <span className="font-mono">{videoCall.meetingId}</span>
        </div>

        <div className="mt-auto">
          <VideoCallDialog videoCall={videoCall} />
        </div>
      </div>
    </div>
  );
}

// Restaurant Card Component
function RestaurantCard({ restaurant }: { restaurant: RestaurantInfo }) {
  return (
    <div className="relative flex h-[180px] flex-col overflow-hidden rounded-xl bg-gradient-to-br from-amber-400/10 via-amber-500/10 to-amber-600/10 p-4 shadow-sm transition-all duration-300 hover:shadow-md dark:from-amber-400/5 dark:via-amber-500/5 dark:to-amber-600/5 dark:hover:shadow-amber-500/5">
      <div className="bg-grid-slate-100 dark:bg-grid-slate-700/25 absolute inset-0 [mask-image:linear-gradient(0deg,transparent,black)]"></div>
      <div className="relative flex flex-1 flex-col">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/10 dark:bg-amber-400/10">
              <svg
                className="h-4 w-4 text-amber-500 dark:text-amber-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v13m0-13V6a2 2 0 112 2v5m-6 0h6m2 0a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4a2 2 0 012-2h2"
                />
              </svg>
            </div>
            <div className="text-foreground font-medium">{restaurant.name}</div>
          </div>
          <div className="rounded-full bg-amber-500/10 px-2 py-1 text-xs font-medium text-amber-500 dark:bg-amber-400/10 dark:text-amber-400">
            {restaurant.reservation.time}
          </div>
        </div>

        <div className="text-muted-foreground mb-2 text-sm">
          <div className="flex items-center gap-1">
            <span>📍</span> {restaurant.address}
          </div>
          <div className="mt-1 flex items-center gap-1">
            <span>👥</span> Party of {restaurant.reservation.partySize}
          </div>
        </div>

        <div className="mt-auto">
          <RestaurantDialog restaurant={restaurant} />
        </div>
      </div>
    </div>
  );
}

// Workshop Card Component
function WorkshopCard({ workshop }: { workshop: WorkshopInfo }) {
  return (
    <div className="relative flex h-[180px] flex-col overflow-hidden rounded-xl bg-gradient-to-br from-cyan-400/10 via-cyan-500/10 to-cyan-600/10 p-4 shadow-sm transition-all duration-300 hover:shadow-md dark:from-cyan-400/5 dark:via-cyan-500/5 dark:to-cyan-600/5 dark:hover:shadow-cyan-500/5">
      <div className="bg-grid-slate-100 dark:bg-grid-slate-700/25 absolute inset-0 [mask-image:linear-gradient(0deg,transparent,black)]"></div>
      <div className="relative flex flex-1 flex-col">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500/10 dark:bg-cyan-400/10">
              <svg
                className="h-4 w-4 text-cyan-500 dark:text-cyan-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <div className="text-foreground font-medium">
              Workshop Materials
            </div>
          </div>
        </div>

        <div className="text-muted-foreground mb-2 text-sm">
          <div className="flex items-center gap-1">
            <span>📚</span> {workshop.materials.length} materials required
          </div>
          {workshop.facilitator && (
            <div className="mt-1 flex items-center gap-1">
              <span>👤</span> {workshop.facilitator}
            </div>
          )}
        </div>

        <div className="mt-auto">
          <WorkshopDialog workshop={workshop} />
        </div>
      </div>
    </div>
  );
}

// Social Event Card Component
function SocialCard({ social }: { social: SocialInfo }) {
  return (
    <div className="h-full rounded-lg bg-purple-500/10 p-4 transition-colors hover:bg-purple-500/15 dark:bg-purple-500/5 dark:hover:bg-purple-500/10">
      <div className="mb-3 flex items-center gap-2">
        <svg
          className="h-5 w-5 text-purple-500 dark:text-purple-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        <span className="text-foreground font-medium">{social.occasion}</span>
      </div>
      <div className="space-y-3">
        <div className="text-muted-foreground text-sm">
          <div>📍 {social.location}</div>
          <div>👥 {social.guests} guests</div>
        </div>
        <div className="space-y-2">
          <div className="bg-background/50 rounded-md p-2">
            <div className="text-foreground mb-1 text-sm font-medium">Menu</div>
            <div className="text-muted-foreground space-y-1 text-sm">
              {social.food.menu.map((item, index) => (
                <div key={index}>• {item}</div>
              ))}
            </div>
          </div>
          <div className="bg-background/50 rounded-md p-2">
            <div className="text-foreground mb-1 text-sm font-medium">
              To Bring
            </div>
            <div className="text-muted-foreground space-y-1 text-sm">
              {social.gifts.map((gift, index) => (
                <div key={index}>• {gift}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Medical Appointment Card Component
function MedicalCard({ medical }: { medical: MedicalInfo }) {
  return (
    <div className="relative flex h-[180px] flex-col overflow-hidden rounded-xl bg-gradient-to-br from-rose-400/10 via-rose-500/10 to-rose-600/10 p-4 shadow-sm transition-all duration-300 hover:shadow-md dark:from-rose-400/5 dark:via-rose-500/5 dark:to-rose-600/5 dark:hover:shadow-rose-500/5">
      <div className="bg-grid-slate-100 dark:bg-grid-slate-700/25 absolute inset-0 [mask-image:linear-gradient(0deg,transparent,black)]"></div>
      <div className="relative flex flex-1 flex-col">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-500/10 dark:bg-rose-400/10">
              <svg
                className="h-4 w-4 text-rose-500 dark:text-rose-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <div className="text-foreground font-medium">
              Dr. {medical.doctor}
            </div>
          </div>
          <div className="inline-flex h-5 items-center whitespace-nowrap rounded-full bg-rose-500/10 px-2 text-xs font-medium text-rose-500 dark:bg-rose-400/10 dark:text-rose-400">
            {medical.specialty}
          </div>
        </div>

        <div className="text-muted-foreground mb-2 text-sm">
          <div className="flex items-center gap-1">
            <span>🏥</span> {medical.clinic}
          </div>
          <div className="mt-1 flex items-center gap-1">
            <span>📍</span> {medical.address}
          </div>
        </div>

        <div className="mt-auto">
          <MedicalDialog medical={medical} />
        </div>
      </div>
    </div>
  );
}

function FlightCard({
  flight,
}: {
  flight: GeneratedUIProps["calendarData"]["events"][0]["flight"];
}) {
  if (!flight) return null;

  const formatFlightTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="relative flex h-[180px] flex-col overflow-hidden rounded-xl bg-gradient-to-br from-sky-400/10 via-sky-500/10 to-sky-600/10 p-4 shadow-sm transition-all duration-300 hover:shadow-md dark:from-sky-400/5 dark:via-sky-500/5 dark:to-sky-600/5 dark:hover:shadow-sky-500/5">
      <div className="bg-grid-slate-100 dark:bg-grid-slate-700/25 absolute inset-0 [mask-image:linear-gradient(0deg,transparent,black)]"></div>
      <div className="relative flex flex-1 flex-col">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-500/10 dark:bg-sky-400/10">
              <svg
                className="h-4 w-4 text-sky-500 dark:text-sky-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="text-foreground font-medium">
              {flight.airline} {flight.flightNumber}
            </div>
          </div>
          <div className="rounded-full bg-sky-500/10 px-2 py-1 text-xs font-medium text-sky-500 dark:bg-sky-400/10 dark:text-sky-400">
            {flight.confirmationCode}
          </div>
        </div>

        <div className="mb-3 grid grid-cols-[1fr,auto,1fr] items-center gap-3">
          <div>
            <div className="text-foreground text-lg font-semibold">
              {flight.departure.airport}
            </div>
            <div className="text-muted-foreground text-sm">
              Gate {flight.departure.gate}
            </div>
            <div className="mt-1 text-sm text-sky-500 dark:text-sky-400">
              {formatFlightTime(flight.departure.time)}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-border/30 dark:bg-border/20 h-[2px] w-12"></div>
            <div className="text-sky-500 dark:text-sky-400">✈️</div>
            <div className="bg-border/30 dark:bg-border/20 h-[2px] w-12"></div>
          </div>

          <div className="text-right">
            <div className="text-foreground text-lg font-semibold">
              {flight.arrival.airport}
            </div>
            <div className="text-muted-foreground text-sm">
              Gate {flight.arrival.gate}
            </div>
            <div className="mt-1 text-sm text-sky-500 dark:text-sky-400">
              {formatFlightTime(flight.arrival.time)}
            </div>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">Seat</span>
              <span className="text-foreground font-medium">
                {flight.seatNumber}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">Group</span>
              <span className="text-foreground font-medium">
                {flight.boardingGroup}
              </span>
            </div>
          </div>
          <div className="text-muted-foreground flex items-center gap-1">
            <span>Terminal</span>
            <span className="text-foreground font-medium">
              {flight.departure.terminal}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function WeatherComponent({ location }: { location: string }) {
  // Mock weather data - in a real app, this would come from a weather API
  const mockWeather = {
    temperature: "72°F",
    condition: "Partly Cloudy",
    precipitation: "60%",
    humidity: "65%",
    wind: "8 mph",
  };

  const shouldTakeUmbrella = parseInt(mockWeather.precipitation) > 30;
  const isWindy = parseInt(mockWeather.wind) > 15;
  const isHot = parseInt(mockWeather.temperature) > 85;

  return (
    <div className="relative h-full overflow-hidden rounded-xl bg-gradient-to-br from-sky-400/10 via-sky-500/10 to-sky-600/10 p-5 shadow-sm transition-all duration-300 hover:shadow-md dark:from-sky-400/5 dark:via-sky-500/5 dark:to-sky-600/5 dark:hover:shadow-sky-500/5">
      <div className="bg-grid-slate-100 dark:bg-grid-slate-700/25 absolute inset-0 [mask-image:linear-gradient(0deg,transparent,black)]"></div>
      <div className="relative">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-500/10 dark:bg-sky-400/10">
              <svg
                className="h-5 w-5 text-sky-500 dark:text-sky-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <span className="text-foreground font-medium">{location}</span>
          </div>
          <div className="text-muted-foreground text-sm">Now</div>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-foreground flex items-baseline text-4xl font-bold tracking-tight">
              {mockWeather.temperature}
              <span className="text-muted-foreground ml-1 text-base font-normal">
                • {mockWeather.condition}
              </span>
            </div>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center rounded-lg bg-sky-500/5 p-3 dark:bg-sky-400/5">
            <div className="mb-1 text-lg text-sky-500 dark:text-sky-400">
              💧
            </div>
            <div className="text-muted-foreground text-sm">Humidity</div>
            <div className="text-foreground font-medium">
              {mockWeather.humidity}
            </div>
          </div>
          <div className="flex flex-col items-center rounded-lg bg-sky-500/5 p-3 dark:bg-sky-400/5">
            <div className="mb-1 text-lg text-sky-500 dark:text-sky-400">
              🌧️
            </div>
            <div className="text-muted-foreground text-sm">Rain</div>
            <div className="text-foreground font-medium">
              {mockWeather.precipitation}
            </div>
          </div>
          <div className="flex flex-col items-center rounded-lg bg-sky-500/5 p-3 dark:bg-sky-400/5">
            <div className="mb-1 text-lg text-sky-500 dark:text-sky-400">
              💨
            </div>
            <div className="text-muted-foreground text-sm">Wind</div>
            <div className="text-foreground font-medium">
              {mockWeather.wind}
            </div>
          </div>
        </div>

        {(shouldTakeUmbrella || isWindy || isHot) && (
          <div className="space-y-2 rounded-lg bg-sky-500/5 p-4 dark:bg-sky-400/5">
            <div className="text-foreground text-sm font-medium">
              Recommendations
            </div>
            <div className="text-muted-foreground space-y-2 text-sm">
              {shouldTakeUmbrella && (
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-500/10 dark:bg-sky-400/10">
                    ☔️
                  </div>
                  <span>Take an umbrella</span>
                </div>
              )}
              {isWindy && (
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-500/10 dark:bg-sky-400/10">
                    🧥
                  </div>
                  <span>Wear a windbreaker</span>
                </div>
              )}
              {isHot && (
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-500/10 dark:bg-sky-400/10">
                    🧴
                  </div>
                  <span>Don't forget sunscreen</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Workout Card Component
function WorkoutCard({ workout }: { workout: WorkoutInfo }) {
  return (
    <div className="relative flex h-[180px] flex-col overflow-hidden rounded-xl bg-gradient-to-br from-orange-400/10 via-red-500/10 to-rose-600/10 p-4 shadow-sm transition-all duration-300 hover:shadow-md dark:from-orange-400/5 dark:via-red-500/5 dark:to-rose-600/5 dark:hover:shadow-rose-500/5">
      <div className="bg-grid-slate-100 dark:bg-grid-slate-700/25 absolute inset-0 [mask-image:linear-gradient(0deg,transparent,black)]"></div>
      <div className="relative flex flex-1 flex-col">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-500/10 dark:bg-rose-400/10">
              <svg
                className="h-4 w-4 text-rose-500 dark:text-rose-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 10h16M4 14h16M4 18h16"
                />
              </svg>
            </div>
            <div className="text-foreground font-medium">{workout.type}</div>
          </div>
          {workout.duration && (
            <div className="rounded-full bg-rose-500/10 px-2 py-1 text-xs font-medium text-rose-500 dark:bg-rose-400/10 dark:text-rose-400">
              {workout.duration} min
            </div>
          )}
        </div>

        <div className="text-muted-foreground mb-2 text-sm">
          <div className="flex items-center gap-1">
            <span>📍</span> {workout.location}
          </div>
          {workout.instructor && (
            <div className="mt-1 flex items-center gap-1">
              <span>👤</span> {workout.instructor}
            </div>
          )}
        </div>

        <div className="mt-auto">
          <WorkoutDialog workout={workout} />
        </div>
      </div>
    </div>
  );
}

// Add new components for Development and Design events
function DevelopmentCard({ development }: { development: DevelopmentInfo }) {
  return (
    <div className="relative flex h-[180px] flex-col overflow-hidden rounded-xl bg-gradient-to-br from-violet-400/10 via-violet-500/10 to-violet-600/10 p-4 shadow-sm transition-all duration-300 hover:shadow-md dark:from-violet-400/5 dark:via-violet-500/5 dark:to-violet-600/5 dark:hover:shadow-violet-500/5">
      <div className="bg-grid-slate-100 dark:bg-grid-slate-700/25 absolute inset-0 [mask-image:linear-gradient(0deg,transparent,black)]"></div>
      <div className="relative flex flex-1 flex-col">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-500/10 dark:bg-violet-400/10">
              <svg
                className="h-4 w-4 text-violet-500 dark:text-violet-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                />
              </svg>
            </div>
            <div className="text-foreground font-medium">Code Review</div>
          </div>
          <div className="rounded-full bg-violet-500/10 px-2 py-1 text-xs font-medium text-violet-500 dark:bg-violet-400/10 dark:text-violet-400">
            {development.deployment.environment}
          </div>
        </div>

        <div className="text-muted-foreground mb-2 text-sm">
          <div className="font-mono">{development.pullRequest}</div>
          <div
            className={`mt-1 grid items-center gap-2 ${
              development.reviewers.length <= 3
                ? "grid-cols-3"
                : development.reviewers.length <= 4
                  ? "grid-cols-4"
                  : "grid-cols-5"
            }`}
          >
            {development.reviewers.map((reviewer, index) => (
              <span
                key={index}
                className="inline-flex h-5 items-center justify-center whitespace-nowrap rounded-full bg-violet-500/5 px-2 text-xs dark:bg-violet-400/5"
              >
                {reviewer}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-auto">
          <DevelopmentDialog development={development} />
        </div>
      </div>
    </div>
  );
}

function DesignCard({ design }: { design: DesignInfo }) {
  return (
    <div className="relative flex h-[180px] flex-col overflow-hidden rounded-xl bg-gradient-to-br from-pink-400/10 via-pink-500/10 to-pink-600/10 p-4 shadow-sm transition-all duration-300 hover:shadow-md dark:from-pink-400/5 dark:via-pink-500/5 dark:to-pink-600/5 dark:hover:shadow-pink-500/5">
      <div className="bg-grid-slate-100 dark:bg-grid-slate-700/25 absolute inset-0 [mask-image:linear-gradient(0deg,transparent,black)]"></div>
      <div className="relative flex flex-1 flex-col">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-500/10 dark:bg-pink-400/10">
              <svg
                className="h-4 w-4 text-pink-500 dark:text-pink-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div className="text-foreground font-medium">Design Review</div>
          </div>
          <div className="rounded-full bg-pink-500/10 px-2 py-1 text-xs font-medium text-pink-500 dark:bg-pink-400/10 dark:text-pink-400">
            {design.research.usability}
          </div>
        </div>

        <div className="text-muted-foreground mb-2 text-sm">
          <div>{design.project}</div>
          <div
            className={`mt-1 grid items-center gap-2 ${
              design.tools.length <= 3
                ? "grid-cols-3"
                : design.tools.length <= 4
                  ? "grid-cols-4"
                  : "grid-cols-5"
            }`}
          >
            {design.tools.map((tool, index) => (
              <span
                key={index}
                className="inline-flex h-5 items-center justify-center whitespace-nowrap rounded-full bg-pink-500/5 px-2 text-xs dark:bg-pink-400/5"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-auto">
          <DesignDialog design={design} />
        </div>
      </div>
    </div>
  );
}

// Update the RenderEventCard function to include new card types
function RenderEventCard({
  event,
}: {
  event: GeneratedUIProps["calendarData"]["events"][0];
}) {
  if (event.videoCall) {
    return <VideoCallCard videoCall={event.videoCall} />;
  }
  if (event.workout) {
    return <WorkoutCard workout={event.workout} />;
  }
  if (event.restaurant) {
    return <RestaurantCard restaurant={event.restaurant} />;
  }
  if (event.medical) {
    return <MedicalCard medical={event.medical} />;
  }
  if (event.development) {
    return <DevelopmentCard development={event.development} />;
  }
  if (event.design) {
    return <DesignCard design={event.design} />;
  }
  if (event.workshop) {
    return <WorkshopCard workshop={event.workshop} />;
  }
  if (event.social) {
    return <SocialCard social={event.social} />;
  }
  if (event.flight) {
    return <FlightCard flight={event.flight} />;
  }

  // Default card for events without specific type
  return (
    <div className="h-full rounded-lg bg-slate-500/10 p-4 transition-colors hover:bg-slate-500/15 dark:bg-slate-500/5 dark:hover:bg-slate-500/10">
      <div className="mb-3 flex items-center gap-2">
        <svg
          className="h-5 w-5 text-gray-500 dark:text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <span className="text-foreground font-medium">{event.title}</span>
      </div>
      {event.notes && (
        <div className="text-muted-foreground mt-2 text-sm">{event.notes}</div>
      )}
      {event.location && (
        <div className="text-muted-foreground mt-2 flex items-center gap-1 text-sm">
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          {event.location}
        </div>
      )}
    </div>
  );
}
