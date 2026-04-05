"use client";

import { useEffect, useState } from "react";
import { getEvents, createEvent, deleteEvent } from "@/lib/api";
import EventCard from "@/components/EventCard";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { PlusIcon } from "lucide-react";

interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  maxVolunteers: number;
  _count: { participations: number };
}

export default function EventsPage() {
  const { isAdmin } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    maxVolunteers: "",
  });

  const fetchEvents = () => {
    setLoading(true);
    getEvents()
      .then((res) => setEvents(res.data))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleCreate = async () => {
    if (!form.title || !form.description || !form.location || !form.date || !form.maxVolunteers) return;
    setSubmitting(true);
    try {
      await createEvent({
        ...form,
        maxVolunteers: parseInt(form.maxVolunteers, 10),
      });
      setForm({ title: "", description: "", location: "", date: "", maxVolunteers: "" });
      setOpen(false);
      fetchEvents();
    } catch {
      alert("Failed to create event");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this event?")) return;
    try {
      await deleteEvent(id);
      fetchEvents();
    } catch {
      alert("Failed to delete event");
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Events</h1>
          <p className="mt-1.5 text-muted-foreground">
            Browse and manage volunteer events
          </p>
        </div>
        {isAdmin && <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger
            render={
              <Button>
                <PlusIcon className="mr-1 size-4" />
                New Event
              </Button>
            }
          />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Event</DialogTitle>
              <DialogDescription>
                Fill in the details to create a new volunteer event.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Event title"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Event description"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={form.location}
                  onChange={(e) =>
                    setForm({ ...form, location: e.target.value })
                  }
                  placeholder="Event location"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="datetime-local"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="maxVolunteers">Max Volunteers</Label>
                  <Input
                    id="maxVolunteers"
                    type="number"
                    min="1"
                    value={form.maxVolunteers}
                    onChange={(e) =>
                      setForm({ ...form, maxVolunteers: e.target.value })
                    }
                    placeholder="e.g. 20"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <DialogClose render={<Button variant="outline" />}>
                Cancel
              </DialogClose>
              <Button onClick={handleCreate} disabled={submitting}>
                {submitting ? "Creating..." : "Create Event"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>}
      </div>

      {loading ? (
        <p className="text-center text-muted-foreground">Loading events...</p>
      ) : events.length === 0 ? (
        <p className="text-center text-muted-foreground">
          No events found. Create one to get started!
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard
              key={event.id}
              id={event.id}
              title={event.title}
              description={event.description}
              location={event.location}
              date={event.date}
              maxVolunteers={event.maxVolunteers}
              participantCount={event._count.participations}
              onDelete={isAdmin ? () => handleDelete(event.id) : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}
