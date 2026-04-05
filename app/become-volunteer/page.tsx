"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { submitVolunteerRequest, getMyVolunteerRequest } from "@/lib/api";
import { useAuth } from "@/components/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2, XCircle, Clock } from "lucide-react";

export default function BecomeVolunteerPage() {
  const { user, refreshUser } = useAuth();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [existingRequest, setExistingRequest] = useState<{
    id: string;
    status: string;
    phone: string;
    address: string;
    skills: string;
  } | null>(null);
  const [form, setForm] = useState({ phone: "", address: "", skills: "" });

  useEffect(() => {
    if (user?.role === "volunteer" || user?.role === "admin") {
      router.push("/events");
      return;
    }

    getMyVolunteerRequest()
      .then((res) => {
        if (res.data) setExistingRequest(res.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.phone || !form.address || !form.skills) {
      setError("All fields are required");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await submitVolunteerRequest(form);
      setSuccess(true);
      await refreshUser();
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { error?: string } } };
      setError(axiosError.response?.data?.error || "Failed to submit request");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  // Show existing request status
  if (existingRequest || success) {
    const status = existingRequest?.status || "pending";
    return (
      <div className="mx-auto max-w-lg px-4 py-16">
        <Card className="shadow-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-extrabold tracking-tight">
              Volunteer Request
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4 py-8">
            {status === "pending" && (
              <>
                <Clock className="size-12 text-yellow-500" />
                <Badge variant="outline" className="text-yellow-600 border-yellow-300 bg-yellow-50 px-4 py-1 text-sm">
                  Pending
                </Badge>
                <p className="text-center text-muted-foreground">
                  Your volunteer request has been submitted and is waiting for admin approval.
                </p>
              </>
            )}
            {status === "approved" && (
              <>
                <CheckCircle2 className="size-12 text-green-500" />
                <Badge variant="outline" className="text-green-600 border-green-300 bg-green-50 px-4 py-1 text-sm">
                  Approved
                </Badge>
                <p className="text-center text-muted-foreground">
                  Your volunteer request has been approved! You now have volunteer access.
                </p>
                <Button onClick={() => router.push("/events")} className="mt-2">
                  Browse Events
                </Button>
              </>
            )}
            {status === "rejected" && (
              <>
                <XCircle className="size-12 text-red-500" />
                <Badge variant="outline" className="text-red-600 border-red-300 bg-red-50 px-4 py-1 text-sm">
                  Rejected
                </Badge>
                <p className="text-center text-muted-foreground">
                  Your volunteer request was rejected. You can submit a new request.
                </p>
                <Button onClick={() => setExistingRequest(null)} variant="outline" className="mt-2">
                  Submit New Request
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-extrabold tracking-tight">
            Become a Volunteer
          </CardTitle>
          <CardDescription>
            Submit your details to request volunteer access. An admin will review your request.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+1 234 567 8900"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="123 Main St, City"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="skills">Skills</Label>
              <Textarea
                id="skills"
                value={form.skills}
                onChange={(e) => setForm({ ...form, skills: e.target.value })}
                placeholder="e.g. First Aid, Teaching, Cooking"
              />
              <p className="text-xs text-muted-foreground">
                Separate skills with commas
              </p>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? (
                <><Loader2 className="mr-2 size-4 animate-spin" />Submitting...</>
              ) : (
                "Submit Request"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
