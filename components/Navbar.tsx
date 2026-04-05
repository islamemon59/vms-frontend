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
    }
  }

  // Don't show navbar on auth pages
  if (pathname === "/signin" || pathname === "/signup") return null;

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-6xl items-center px-4">
        <Link href="/" className="mr-8 flex items-center gap-2 text-lg font-bold tracking-tight">
          <HeartHandshakeIcon className="size-6 text-primary" />
          <span>VMS</span>
        </Link>
        <nav className="flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                pathname === link.href
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-3">
          {loading ? null : user ? (
            <>
              <span className="text-sm text-muted-foreground">{user.name}</span>
              {isAdmin && <Badge variant="default" className="text-xs">Admin</Badge>}
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOutIcon className="mr-1 size-4" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/signin">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
