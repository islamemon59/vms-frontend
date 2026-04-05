"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createVolunteer } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function RegisterPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    skills: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.address || !form.skills) {
      setError("All fields are required");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await createVolunteer(form);
      router.push("/volunteers");
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { error?: string } } };
      setError(axiosError.response?.data?.error || "Failed to register");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-extrabold tracking-tight">Volunteer Registration</CardTitle>
          <CardDescription>
            Fill in your details to register as a volunteer.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="John Doe"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="john@example.com"
              />
            </div>
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
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? "Registering..." : "Register"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
