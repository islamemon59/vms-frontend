"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { HeartHandshakeIcon, LogOutIcon } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Navbar() {
  const pathname = usePathname();
  const { user, loading, logout, isAdmin } = useAuth();

  // Build nav links based on auth state
  const navLinks = [];
  if (user) {
    navLinks.push({ href: "/events", label: "Events" });
    if (isAdmin) {
      navLinks.push({ href: "/volunteers", label: "Volunteers" });
      navLinks.push({ href: "/register", label: "Register" });
      navLinks.push({ href: "/dashboard", label: "Dashboard" });
      navLinks.push({ href: "/volunteer-requests", label: "Requests" });
    }
    if (user.role === "user") {
      navLinks.push({ href: "/become-volunteer", label: "Become a Volunteer" });
    }
  }

  // Don't show navbar on auth pages
  if (pathname === "/signin" || pathname === "/signup") return null;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/60 backdrop-blur-2xl transition-all duration-300 shadow-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 lg:px-8">
        <Link href="/" className="group flex items-center gap-3 text-xl font-black tracking-tight text-foreground transition-colors hover:text-primary">
          <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-primary/50 text-white shadow-md shadow-primary/20 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
            <HeartHandshakeIcon className="size-5" />
          </div>
          <span>VMS<span className="text-primary">.</span></span>
        </Link>
        <nav className="hidden md:flex items-center gap-1 mx-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300",
                pathname === link.href
                  ? "bg-primary/10 text-primary shadow-inner"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground active:scale-95"
              )}
            >
              {link.label}
              {pathname === link.href && (
                <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary" />
              )}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          {loading ? (
            <div className="h-9 w-20 animate-pulse rounded-full bg-muted" />
          ) : user ? (
            <>
              <div className="hidden sm:flex flex-col items-end mr-2">
                <span className="text-sm font-bold leading-tight">{user.name}</span>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {user.role}
                </span>
              </div>
              {isAdmin && <Badge variant="default" className="hidden sm:inline-flex text-[10px] font-bold px-2 py-0.5 bg-gradient-to-r from-red-500 to-orange-500 border-none shadow-md shadow-red-500/20">Admin</Badge>}
              {user.role === "volunteer" && <Badge variant="secondary" className="hidden sm:inline-flex text-[10px] font-bold px-2 py-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-none shadow-md shadow-blue-500/20">Volunteer</Badge>}
              <Button variant="ghost" size="icon" onClick={logout} className="rounded-full hover:bg-destructive/10 hover:text-destructive group transition-colors">
                <LogOutIcon className="size-5 transition-transform group-hover:-translate-x-0.5" />
              </Button>
            </>
          ) : (
            <>
              <Link href="/signin">
                <Button variant="ghost" className="rounded-full font-semibold transition-transform hover:scale-105 active:scale-95">Sign In</Button>
              </Link>
              <Link href="/signup">
                <Button className="rounded-full font-bold shadow-md shadow-primary/20 transition-transform hover:scale-105 active:scale-95">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
