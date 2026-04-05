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
import { HomeIcon, Loader2 } from "lucide-react";

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
    <div className="flex min-h-screen items-center justify-center px-4 bg-muted/40 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
      <div className="absolute -top-40 -right-40 -z-10 h-96 w-96 rounded-full bg-primary/20 blur-3xl opacity-50" />
      <div className="absolute -bottom-40 -left-40 -z-10 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl opacity-50" />
      
      <div className="w-full max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <Card className="shadow-2xl shadow-primary/10 border-border/50 bg-background/60 backdrop-blur-xl">
          <CardHeader className="text-center space-y-2 pb-6">
            <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-indigo-500 shadow-xl shadow-primary/30">
              <span className="text-xl font-black text-white">VMS<span className="text-white/80">.</span></span>
            </div>
            <CardTitle className="text-3xl font-extrabold tracking-tight bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">Welcome Back</CardTitle>
            <CardDescription className="text-base">Enter your credentials to access VMS</CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="grid gap-5">
              <div className="grid gap-2">
                <Label htmlFor="email" className="font-semibold text-foreground/80">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="admin@example.com"
                  className="bg-background/50 h-11 transition-all focus-visible:ring-primary/50"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password" className="font-semibold text-foreground/80">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="bg-background/50 h-11 transition-all focus-visible:ring-primary/50"
                  autoComplete="current-password"
                />
              </div>
              {error && (
                <div className="rounded-lg bg-destructive/10 p-3 flex items-center gap-2 text-sm text-destructive font-medium animate-in slide-in-from-top-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-destructive animate-pulse" />
                  {error}
                </div>
              )}
              <Button type="submit" disabled={submitting} className="w-full h-11 mt-2 font-bold shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 mt-2 active:scale-[0.98]">
                {submitting ? <><Loader2 className="mr-2 size-5 animate-spin" />Signing in...</> : "Sign In"}
              </Button>
            </form>
            
            <div className="mt-8 flex flex-col items-center gap-4">
              <p className="text-sm font-medium text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="font-bold text-primary transition-colors hover:text-primary/80 hover:underline underline-offset-4">
                  Sign Up
                </Link>
              </p>
              
              <Link href="/" className="group flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-all duration-300 hover:text-foreground hover:bg-muted/50 px-4 py-2 rounded-full">
                <HomeIcon className="size-4 transition-transform group-hover:-translate-x-1" />
                Back to Home
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
