"use client";

import { useEffect, useState } from "react";
import { getVolunteers } from "@/lib/api";
import VolunteerTable from "@/components/VolunteerTable";
import { Loader2 } from "lucide-react";

interface Volunteer {
  id: string;
  name: string;
  email: string;
  phone: string;
  skills: string;
  participations?: { id: string; event: { title: string }; status: string }[];
}

export default function VolunteersPage() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getVolunteers()
      .then((res) => setVolunteers(res.data))
      .catch(() => setVolunteers([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight">Volunteers</h1>
        <p className="mt-1.5 text-muted-foreground">
          View all registered volunteers
        </p>
      </div>

      {loading ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="size-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading volunteers...</p>
          </div>
        </div>
      ) : (
        <VolunteerTable volunteers={volunteers} />
      )}
    </div>
  );
}
