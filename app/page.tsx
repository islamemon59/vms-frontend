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
    <div className="relative isolate overflow-hidden bg-background">
      {/* Decorative Blob */}
      <div className="absolute top-0 -z-10 h-full w-full bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-primary/20 via-background to-background" />

      <div className="mx-auto max-w-6xl px-4 py-24 sm:py-32 lg:py-40">
        {/* Hero Section */}
        <section className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <div className="mb-8 flex size-20 items-center justify-center rounded-3xl bg-linear-to-tr from-primary to-primary/40 shadow-xl ring-1 ring-primary/20 transition-transform duration-500 hover:scale-110 hover:rotate-3">
            <svg
              className="size-10 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
          </div>
          <h1 className="text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl">
            Volunteer Management <br className="hidden sm:block" />
            <span className="bg-linear-to-r from-primary to-indigo-500 bg-clip-text text-transparent drop-shadow-sm">System</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground/90 font-medium">
            Empower communities by organizing impactful events, connecting passionate volunteers, and seamlessly tracking every moment of participation.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            {user ? (
              <>
                <Link href="/events" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full text-base px-8 h-14 rounded-full shadow-lg shadow-primary/25 transition-transform active:scale-95">Browse Events</Button>
                </Link>
                {user.role === "admin" && (
                  <Link href="/dashboard" className="w-full sm:w-auto">
                    <Button variant="secondary" size="lg" className="w-full text-base px-8 h-14 rounded-full border border-border bg-background/50 backdrop-blur hover:bg-muted transition-transform active:scale-95">Admin Dashboard</Button>
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link href="/signin" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full text-base px-8 h-14 rounded-full shadow-lg shadow-primary/25 transition-transform active:scale-95">Sign In</Button>
                </Link>
                <Link href="/signup" className="w-full sm:w-auto">
                  <Button variant="secondary" size="lg" className="w-full text-base px-8 h-14 rounded-full border border-border bg-background/50 backdrop-blur hover:bg-muted transition-transform active:scale-95">Sign Up Now</Button>
                </Link>
              </>
            )}
          </div>
        </section>

        {/* Diagonal Line Separator */}
        <div className="my-24 h-px w-full bg-linear-to-r from-transparent via-border to-transparent" />

        {/* Upcoming Events Section */}
        <section className="relative z-10">
          <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight">Upcoming Events</h2>
              <p className="text-muted-foreground mt-2 font-medium">Discover what&apos;s happening next in your community.</p>
            </div>
            <Link href="/events" className="shrink-0">
              <Button variant="link" className="group font-semibold text-primary">
                View all events 
                <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">→</span>
              </Button>
            </Link>
          </div>
          {loading ? (
            <div className="flex min-h-[30vh] items-center justify-center rounded-3xl border border-dashed border-border/50 bg-muted/10 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="size-10 animate-spin text-primary" />
                <p className="text-sm font-medium text-muted-foreground">Loading exciting events...</p>
              </div>
            </div>
          ) : upcomingEvents.length === 0 ? (
            <div className="flex min-h-[30vh] items-center justify-center rounded-3xl border border-dashed border-border/50 bg-muted/10 backdrop-blur-sm">
              <p className="text-center font-medium text-muted-foreground">
                No upcoming events right now. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {upcomingEvents.map((event, i) => (
                <div key={event.id} className="animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both" style={{ animationDelay: `${i * 150}ms` }}>
                  <EventCard
                    id={event.id}
                    title={event.title}
                    description={event.description}
                    location={event.location}
                    date={event.date}
                    maxVolunteers={event.maxVolunteers}
                    participantCount={event._count.participations}
                  />
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
