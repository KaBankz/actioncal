/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { motion } from "framer-motion";

// Add these new interfaces for our event types
interface VideoCallInfo {
  platform: string;
  link: string;
  meetingId: string;
  passcode: string;
  joinBeforeHost: boolean;
}

interface WorkoutInfo {
  type: string;
  exercises: Array<{ name: string; sets: number; reps: string }>;
  location: string;
  trainer: string;
}

interface RestaurantInfo {
  name: string;
  address: string;
  reservation: {
    time: string;
    confirmation: string;
    partySize: number;
  };
  menu: string;
  dietaryOptions: string[];
}

interface PresentationInfo {
  file: string;
  slides: number;
  duration: string;
  sharedWith: string[];
  requiredMaterials: string[];
}

interface MedicalInfo {
  doctor: string;
  specialty: string;
  clinic: string;
  address: string;
  floor: string;
  insurance: string;
  documents: string[];
  parking: string;
}

interface WorkshopInfo {
  materials: string[];
  prerequisites: string[];
  repository: string;
  exercises: string[];
}

interface SocialInfo {
  occasion: string;
  location: string;
  guests: number;
  gifts: string[];
  food: {
    menu: string[];
    dietary: string[];
    responsibilities: string;
  };
}

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
    <div className="grid grid-cols-12 gap-6 p-6">
      {/* Timeline Column */}
      <div className="col-span-4">
        <div className="sticky top-6">
          <h2 className="mb-6 text-2xl font-bold">Today's Schedule</h2>
          <div className="space-y-4">
            {sortedEvents.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all duration-200 hover:border-blue-300 hover:shadow-md"
              >
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className="text-sm font-medium text-gray-500">
                      {formatTime(event.startTime)}
                    </div>
                    <div className="mt-1 h-full w-0.5 bg-gray-200"></div>
                    <div className="text-sm font-medium text-gray-500">
                      {formatTime(event.endTime)}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {event.title}
                    </div>
                    <div className="mt-1 text-sm text-gray-600">
                      {event.notes}
                    </div>
                    {event.location && (
                      <div className="mt-2 text-sm text-gray-600">
                        📍 {event.location}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Bento Box Layout for Components */}
      <div className="col-span-8">
        <div className="grid grid-cols-8 gap-4">
          {/* Weather Section - Spans 5 columns */}
          {sortedEvents.some((event) => event.location) && (
            <div className="col-span-5">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="h-full rounded-xl border border-gray-200 bg-white p-4"
              >
                {sortedEvents.map(
                  (event, index) =>
                    event.location && (
                      <WeatherComponent key={index} location={event.location} />
                    ),
                )}
              </motion.div>
            </div>
          )}

          {/* Quick Actions - Spans 3 columns */}
          <div className="col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-gray-200 bg-white p-4"
            >
              <h3 className="mb-3 font-semibold">Quick Actions</h3>
              <div className="space-y-2">
                {sortedEvents.map((event, index) => (
                  <QuickActionButton key={index} event={event} />
                ))}
              </div>
            </motion.div>
          </div>

          {/* Travel Information - Spans full width when present */}
          {sortedEvents.some((event) => event.flight) && (
            <div className="col-span-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-gray-200 bg-white p-4"
              >
                {sortedEvents.map(
                  (event, index) =>
                    event.flight && (
                      <FlightCard key={index} flight={event.flight} />
                    ),
                )}
              </motion.div>
            </div>
          )}

          {/* Video Calls Section */}
          {sortedEvents.some((event) => event.videoCall) && (
            <div className="col-span-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-gray-200 bg-white p-4"
              >
                {sortedEvents.map(
                  (event, index) =>
                    event.videoCall && (
                      <VideoCallCard key={index} videoCall={event.videoCall} />
                    ),
                )}
              </motion.div>
            </div>
          )}

          {/* Render all other event type cards */}
          {sortedEvents.map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="col-span-4"
            >
              {event.workout && <WorkoutCard workout={event.workout} />}
              {event.restaurant && (
                <RestaurantCard restaurant={event.restaurant} />
              )}
              {event.medical && <MedicalCard medical={event.medical} />}
              {event.workshop && <WorkshopCard workshop={event.workshop} />}
              {event.social && <SocialCard social={event.social} />}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Update QuickActionButton to use event data directly
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
          className="flex w-full items-center justify-between rounded-lg bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100"
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
        <button className="flex w-full items-center justify-between rounded-lg bg-green-50 px-4 py-2 text-sm font-medium text-green-700 hover:bg-green-100">
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
    <div className="rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
      <div className="mb-3 flex items-center gap-2">
        <svg
          className="h-5 w-5 text-blue-600"
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
        <span className="font-medium">{videoCall.platform} Meeting</span>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Meeting ID:</span>
          <span className="font-mono">{videoCall.meetingId}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Passcode:</span>
          <span className="font-mono">{videoCall.passcode}</span>
        </div>
      </div>
      <a
        href={videoCall.link}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 block rounded-lg bg-blue-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-blue-700"
      >
        Join Meeting
      </a>
    </div>
  );
}

// Restaurant Card Component
function RestaurantCard({ restaurant }: { restaurant: RestaurantInfo }) {
  return (
    <div className="col-span-3 rounded-lg bg-gradient-to-r from-amber-50 to-yellow-50 p-4">
      <div className="mb-3 flex items-center gap-2">
        <svg
          className="h-5 w-5 text-amber-600"
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
        <span className="font-medium">{restaurant.name}</span>
      </div>
      <div className="space-y-3">
        <div className="rounded-md bg-white p-3">
          <div className="mb-2 text-sm text-gray-600">
            <div>📍 {restaurant.address}</div>
            <div className="mt-1">
              <span className="font-medium">Reservation:</span>{" "}
              {restaurant.reservation.time}
            </div>
            <div className="text-xs">
              Confirmation: {restaurant.reservation.confirmation}
            </div>
          </div>
        </div>
        <div className="rounded-md bg-white p-2">
          <div className="mb-1 text-sm font-medium">Dietary Options</div>
          <div className="flex flex-wrap gap-2">
            {restaurant.dietaryOptions.map((option, index) => (
              <span
                key={index}
                className="rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700"
              >
                {option}
              </span>
            ))}
          </div>
        </div>
        <a
          href={restaurant.menu}
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-lg bg-amber-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-amber-700"
        >
          View Menu
        </a>
      </div>
    </div>
  );
}

// Workshop Card Component
function WorkshopCard({ workshop }: { workshop: WorkshopInfo }) {
  return (
    <div className="col-span-3 rounded-lg bg-gradient-to-r from-cyan-50 to-sky-50 p-4">
      <div className="mb-3 flex items-center gap-2">
        <svg
          className="h-5 w-5 text-cyan-600"
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
        <span className="font-medium">Workshop Materials</span>
      </div>
      <div className="space-y-3">
        <div className="rounded-md bg-white p-3">
          <div className="mb-2 text-sm">
            <div className="font-medium">Required Materials</div>
            <div className="mt-1 space-y-1 text-gray-600">
              {workshop.materials.map((material, index) => (
                <div key={index}>• {material}</div>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="rounded-md bg-white p-2">
            <div className="mb-1 text-sm font-medium">Prerequisites</div>
            <div className="space-y-1 text-sm text-gray-600">
              {workshop.prerequisites.map((prereq, index) => (
                <div key={index}>• {prereq}</div>
              ))}
            </div>
          </div>
          <a
            href={`https://${workshop.repository}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-lg bg-cyan-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-cyan-700"
          >
            View Repository
          </a>
        </div>
      </div>
    </div>
  );
}

// Social Event Card Component
function SocialCard({ social }: { social: SocialInfo }) {
  return (
    <div className="col-span-3 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 p-4">
      <div className="mb-3 flex items-center gap-2">
        <svg
          className="h-5 w-5 text-purple-600"
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
        <span className="font-medium">{social.occasion}</span>
      </div>
      <div className="space-y-3">
        <div className="text-sm text-gray-600">
          <div>📍 {social.location}</div>
          <div>👥 {social.guests} guests</div>
        </div>
        <div className="space-y-2">
          <div className="rounded-md bg-white p-2">
            <div className="mb-1 text-sm font-medium">Menu</div>
            <div className="space-y-1 text-sm text-gray-600">
              {social.food.menu.map((item, index) => (
                <div key={index}>• {item}</div>
              ))}
            </div>
          </div>
          <div className="rounded-md bg-white p-2">
            <div className="mb-1 text-sm font-medium">To Bring</div>
            <div className="space-y-1 text-sm text-gray-600">
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
    <div className="col-span-3 rounded-lg bg-gradient-to-r from-red-50 to-rose-50 p-4">
      <div className="mb-3 flex items-center gap-2">
        <svg
          className="h-5 w-5 text-red-600"
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
        <span className="font-medium">Medical Appointment</span>
      </div>
      <div className="space-y-3">
        <div className="rounded-md bg-white p-3">
          <div className="mb-2">
            <div className="font-medium">{medical.doctor}</div>
            <div className="text-sm text-gray-600">{medical.specialty}</div>
          </div>
          <div className="text-sm text-gray-600">
            <div>📍 {medical.clinic}</div>
            <div>{medical.floor}</div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="rounded-md bg-white p-2">
            <div className="mb-1 text-sm font-medium">Required Documents</div>
            <div className="space-y-1 text-sm text-gray-600">
              {medical.documents.map((doc, index) => (
                <div key={index}>• {doc}</div>
              ))}
            </div>
          </div>
          <div className="text-sm text-gray-600">
            <div>🅿️ {medical.parking}</div>
            <div>🏥 Insurance: {medical.insurance}</div>
          </div>
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
    <div className="mt-4 overflow-hidden rounded-lg border border-blue-100 bg-white shadow-sm">
      <div className="border-b border-blue-100 bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg
              className="h-6 w-6 text-white"
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
            <div className="text-lg font-semibold text-white">
              {flight.airline} - {flight.flightNumber}
            </div>
          </div>
          <div className="text-sm text-white">
            Confirmation: {flight.confirmationCode}
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="text-sm text-gray-500">Departure</div>
            <div className="text-xl font-bold text-gray-800">
              {flight.departure.airport}
            </div>
            <div className="mt-1 text-sm text-gray-600">
              Terminal {flight.departure.terminal} • Gate{" "}
              {flight.departure.gate}
            </div>
            <div className="mt-1 text-sm font-medium text-blue-600">
              {formatFlightTime(flight.departure.time)}
            </div>
          </div>

          <div className="px-4">
            <svg
              className="h-8 w-8 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </div>

          <div className="flex-1 text-right">
            <div className="text-sm text-gray-500">Arrival</div>
            <div className="text-xl font-bold text-gray-800">
              {flight.arrival.airport}
            </div>
            <div className="mt-1 text-sm text-gray-600">
              Terminal {flight.arrival.terminal} • Gate {flight.arrival.gate}
            </div>
            <div className="mt-1 text-sm font-medium text-blue-600">
              {formatFlightTime(flight.arrival.time)}
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
          <div className="flex items-center gap-4">
            <div>
              <div className="text-sm text-gray-500">Seat</div>
              <div className="text-lg font-semibold text-gray-800">
                {flight.seatNumber}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Boarding Group</div>
              <div className="text-lg font-semibold text-gray-800">
                Group {flight.boardingGroup}
              </div>
            </div>
          </div>
          <div className="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
            Boarding Pass
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
    precipitation: "10%",
    humidity: "65%",
    wind: "8 mph",
    icon: (
      <svg
        className="h-12 w-12 text-yellow-400"
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
    ),
  };

  return (
    <div className="mt-4 overflow-hidden rounded-lg bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50 shadow-sm">
      <div className="border-b border-blue-100 bg-white/40 px-4 py-2">
        <div className="text-sm font-medium text-gray-600">
          Weather Forecast
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {mockWeather.icon}
            <div>
              <div className="text-2xl font-bold text-gray-800">
                {mockWeather.temperature}
              </div>
              <div className="text-md font-medium text-gray-600">
                {mockWeather.condition}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="space-y-1 text-sm text-gray-600">
              <div>💧 Humidity: {mockWeather.humidity}</div>
              <div>🌧️ Rain: {mockWeather.precipitation}</div>
              <div>💨 Wind: {mockWeather.wind}</div>
            </div>
          </div>
        </div>
        <div className="mt-3 text-xs text-gray-500">📍 {location}</div>
      </div>
    </div>
  );
}

// Workout Card Component
function WorkoutCard({ workout }: { workout: WorkoutInfo }) {
  return (
    <div className="col-span-3 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 p-4">
      <div className="mb-3 flex items-center gap-2">
        <svg
          className="h-5 w-5 text-green-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
        <span className="font-medium">{workout.type} Workout</span>
      </div>
      <div className="space-y-3">
        <div className="text-sm text-gray-600">
          <div className="mb-2">📍 {workout.location}</div>
          <div>👤 Trainer: {workout.trainer}</div>
        </div>
        <div className="space-y-2">
          {workout.exercises.map((exercise, index) => (
            <div key={index} className="rounded-md bg-white p-2 text-sm">
              <div className="font-medium">{exercise.name}</div>
              <div className="text-gray-600">
                {exercise.sets} sets × {exercise.reps} reps
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
