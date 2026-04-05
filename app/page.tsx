"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getEvents } from "@/lib/api";
import { useAuth } from "@/components/AuthProvider";
import EventCard from "@/components/EventCard";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  maxVolunteers: number;
  _count: { participations: number };
}

export default function Home() {
  const { user } = useAuth();
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEvents()
      .then((res) => {
        const now = new Date();
        const upcoming = res.data
          .filter((e: Event) => new Date(e.date) >= now)
          .slice(0, 3);
        setUpcomingEvents(upcoming);
      })
      .catch(() => setUpcomingEvents([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      {/* Hero */}
      <section className="mb-20 text-center">
        <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl bg-primary/10">
          <svg className="size-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
          </svg>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
          Volunteer Management
          <span className="block text-primary">System</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Organize community events, register volunteers, and track
          participation — all in one place.
        </p>
        <div className="mt-10 flex justify-center gap-4">
          {user ? (
            <>
              <Link href="/events">
                <Button size="lg" className="text-base px-6">Browse Events</Button>
              </Link>
              {user.role === "admin" && (
                <Link href="/dashboard">
                  <Button variant="outline" size="lg" className="text-base px-6">Dashboard</Button>
                </Link>
              )}
            </>
          ) : (
            <>
              <Link href="/signin">
                <Button size="lg" className="text-base px-6">Sign In</Button>
              </Link>
              <Link href="/signup">
                <Button variant="outline" size="lg" className="text-base px-6">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Upcoming Events */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Upcoming Events</h2>
          <Link href="/events">
            <Button variant="ghost">View all →</Button>
          </Link>
        </div>
        {loading ? (
          <div className="flex min-h-[20vh] items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="size-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Loading events...</p>
            </div>
          </div>
        ) : upcomingEvents.length === 0 ? (
          <p className="text-center text-muted-foreground">
            No upcoming events yet.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {upcomingEvents.map((event) => (
              <EventCard
                key={event.id}
                id={event.id}
                title={event.title}
                description={event.description}
                location={event.location}
                date={event.date}
                maxVolunteers={event.maxVolunteers}
                participantCount={event._count.participations}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
