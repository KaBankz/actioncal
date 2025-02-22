'use client';

import { useEffect, useState } from 'react';

interface CalendarEvent {
  id: string;
  start: string;
  summary: string;
}

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/calendar');
      const data = await response.json();
      if (data.error && data.error.includes('No token available')) {
        // If no token exists, trigger the auth flow by calling POST /api/calendar
        const authResponse = await fetch('/api/calendar', { method: 'POST' });
        const authData = await authResponse.json();
        if (authData.url) {
          // Redirect to the Google OAuth consent screen
          window.location.href = authData.url;
          return;
        }
      } else if (data.error) {
        setError(data.error);
      } else {
        setEvents(data.events);
      }
    } catch (err) {
      setError('Failed to fetch calendar events');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Upcoming Calendar Events</h1>
      <div className="space-y-4">
        {events.length === 0 ? (
          <p className="text-gray-500">No upcoming events found.</p>
        ) : (
          events.map((event) => (
            <div
              key={event.id}
              className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="font-semibold">{event.summary}</div>
              <div className="text-sm text-gray-500">
                {new Date(event.start).toLocaleString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
