"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  getEvent,
  getVolunteers,
  createParticipation,
  deleteParticipation,
} from "@/lib/api";
import { useAuth } from "@/components/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CalendarIcon,
  MapPinIcon,
  UsersIcon,
  TrashIcon,
  Loader2,
} from "lucide-react";

interface Volunteer {
  id: string;
  name: string;
  email: string;
}

interface Participation {
  id: string;
  status: string;
  volunteer: Volunteer;
}

interface EventDetail {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  maxVolunteers: number;
  participations: Participation[];
  _count: { participations: number };
}

export default function EventDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { isAdmin } = useAuth();

  const [event, setEvent] = useState<EventDetail | null>(null);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [selectedVolunteer, setSelectedVolunteer] = useState("");
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    getEvent(id)
      .then((res) => setEvent(res.data))
      .catch(() => setEvent(null))
      .finally(() => setLoading(false));
    getVolunteers()
      .then((res) => setVolunteers(res.data))
      .catch(() => setVolunteers([]));
  }, [id]);

  const fetchEvent = () => {
    getEvent(id)
      .then((res) => setEvent(res.data))
      .catch(() => setEvent(null));
  };

  const handleJoin = async () => {
    if (!selectedVolunteer) return;
    setJoining(true);
    try {
      await createParticipation({
        volunteerId: selectedVolunteer,
        eventId: id,
      });
      setSelectedVolunteer("");
      fetchEvent();
    } catch {
      alert("Failed to join event. The volunteer may already be registered.");
    } finally {
      setJoining(false);
    }
  };

  const handleRemove = async (participationId: string) => {
    try {
      await deleteParticipation(participationId);
      fetchEvent();
    } catch {
      alert("Failed to remove participant");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading event...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <p className="text-center text-muted-foreground">Event not found.</p>
      </div>
    );
  }

  const eventDate = new Date(event.date);
  const isFull = event._count.participations >= event.maxVolunteers;
  const isPast = eventDate < new Date();

  // Filter out volunteers already participating
  const participatingIds = new Set(
    event.participations.map((p) => p.volunteer.id)
  );
  const availableVolunteers = volunteers.filter(
    (v) => !participatingIds.has(v.id)
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="text-2xl">{event.title}</CardTitle>
              <p className="mt-2 text-muted-foreground">
                {event.description}
              </p>
            </div>
            {isPast ? (
              <Badge variant="secondary">Past</Badge>
            ) : isFull ? (
              <Badge variant="destructive">Full</Badge>
            ) : (
              <Badge variant="default">Open</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CalendarIcon className="size-4" />
              {eventDate.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
            <div className="flex items-center gap-2">
              <MapPinIcon className="size-4" />
              {event.location}
            </div>
            <div className="flex items-center gap-2">
              <UsersIcon className="size-4" />
              {event._count.participations} / {event.maxVolunteers} volunteers
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Join Event */}
      {!isPast && !isFull && availableVolunteers.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Join this Event</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <Select
                  value={selectedVolunteer}
                  onValueChange={(val) => setSelectedVolunteer(val ?? "")}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a volunteer" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableVolunteers.map((v) => (
                      <SelectItem key={v.id} value={v.id}>
                        {v.name} ({v.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleJoin} disabled={joining || !selectedVolunteer}>
                {joining ? "Joining..." : "Join Event"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Participants */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">
            Participants ({event.participations.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {event.participations.length === 0 ? (
            <p className="text-muted-foreground">
              No participants yet.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {event.participations.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">
                      {p.volunteer.name}
                    </TableCell>
                    <TableCell>{p.volunteer.email}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{p.status}</Badge>
                    </TableCell>
                    <TableCell>
                      {isAdmin && (
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => handleRemove(p.id)}
                        >
                          <TrashIcon className="size-3.5 text-destructive" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
