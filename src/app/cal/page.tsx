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
      
      if (data.error) {
        if (data.error.includes('No token available')) {
          // If no token, trigger auth flow
          const authResponse = await fetch('/api/calendar', {
            method: 'POST'
          });
          const authData = await authResponse.json();
          if (authData.url) {
            // Redirect to Google auth
            window.location.href = authData.url;
            return;
          }
        }
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

  const refreshEvents = () => {
    setLoading(true);
    setError(null);
    fetchEvents();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Upcoming Calendar Events</h1>
        <button 
          onClick={refreshEvents}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Refresh
        </button>
      </div>

      {error ? (
        <div className="p-4 bg-red-100 text-red-700 rounded mb-4">
          Error: {error}
        </div>
      ) : null}

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