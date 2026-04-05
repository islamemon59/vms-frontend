"use client";

import { useEffect, useState } from "react";
import { getVolunteers, getEvents, getParticipations } from "@/lib/api";
import DashboardStats from "@/components/DashboardStats";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  maxVolunteers: number;
  _count: { participations: number };
}

interface Participation {
  id: string;
  status: string;
  volunteer: { name: string; email: string };
  event: { title: string };
}

export default function DashboardPage() {
  const [totalVolunteers, setTotalVolunteers] = useState(0);
  const [totalEvents, setTotalEvents] = useState(0);
  const [upcomingEvents, setUpcomingEvents] = useState(0);
  const [totalParticipations, setTotalParticipations] = useState(0);
  const [recentEvents, setRecentEvents] = useState<Event[]>([]);
  const [recentParticipations, setRecentParticipations] = useState<
    Participation[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getVolunteers(), getEvents(), getParticipations()])
      .then(([volRes, evtRes, partRes]) => {
        setTotalVolunteers(volRes.data.length);
        setTotalEvents(evtRes.data.length);
        const now = new Date();
        setUpcomingEvents(
          evtRes.data.filter((e: Event) => new Date(e.date) >= now).length
        );
        setTotalParticipations(partRes.data.length);
        setRecentEvents(evtRes.data.slice(0, 5));
        setRecentParticipations(partRes.data.slice(0, 10));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <p className="text-center text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight">Dashboard</h1>
        <p className="mt-1.5 text-muted-foreground">
          Overview of the Volunteer Management System
        </p>
      </div>

      <DashboardStats
        totalVolunteers={totalVolunteers}
        totalEvents={totalEvents}
        upcomingEvents={upcomingEvents}
        totalParticipations={totalParticipations}
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Recent Events */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Events</CardTitle>
          </CardHeader>
          <CardContent>
            {recentEvents.length === 0 ? (
              <p className="text-muted-foreground">No events yet.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Volunteers</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentEvents.map((e) => (
                    <TableRow key={e.id}>
                      <TableCell className="font-medium">{e.title}</TableCell>
                      <TableCell>
                        {new Date(e.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {e._count.participations} / {e.maxVolunteers}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Recent Participations */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Participations</CardTitle>
          </CardHeader>
          <CardContent>
            {recentParticipations.length === 0 ? (
              <p className="text-muted-foreground">No participations yet.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Volunteer</TableHead>
                    <TableHead>Event</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentParticipations.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">
                        {p.volunteer.name}
                      </TableCell>
                      <TableCell>{p.event.title}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{p.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
