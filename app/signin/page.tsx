"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signin as signinApi } from "@/lib/api";
import { useAuth } from "@/components/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignInPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("All fields are required");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const res = await signinApi(form);
      login(res.data.token, res.data.user);
      router.push(res.data.user.role === "admin" ? "/dashboard" : "/events");
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { error?: string } } };
      setError(axiosError.response?.data?.error || "Failed to sign in");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-20">
      <Card className="shadow-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-extrabold tracking-tight">Sign In</CardTitle>
          <CardDescription>Enter your credentials to access VMS</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="admin@example.com"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-medium text-primary hover:underline">
              Sign Up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
