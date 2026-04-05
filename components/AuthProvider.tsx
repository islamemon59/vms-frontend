"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getMe } from "@/lib/api";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  volunteerRequestStatus?: string | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
  isAdmin: boolean;
  isVolunteer: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
  refreshUser: async () => {},
  isAdmin: false,
  isVolunteer: false,
});

export const useAuth = () => useContext(AuthContext);

// Routes that don't require authentication
const publicPaths = ["/signin", "/signup", "/"];

// Routes that require admin role
const adminPaths = ["/dashboard", "/volunteers", "/register", "/volunteer-requests"];

// Routes that require at least volunteer role
const volunteerPaths = ["/events"];

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === "undefined") return null;
    const cached = localStorage.getItem("user");
    if (cached) {
      try { return JSON.parse(cached); } catch { return null; }
    }
    return null;
  });
  const [loading, setLoading] = useState(() => {
    if (typeof window === "undefined") return true;
    return !!localStorage.getItem("token");
  });
  const router = useRouter();
  const pathname = usePathname();

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/signin");
  }, [router]);

  const login = useCallback((token: string, userData: User) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const res = await getMe();
      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    let cancelled = false;
    getMe()
      .then((res) => {
        if (!cancelled) {
          setUser(res.data);
          localStorage.setItem("user", JSON.stringify(res.data));
        }
      })
      .catch(() => {
        if (!cancelled) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  // Route guard
  useEffect(() => {
    if (loading) return;

    const isPublic = publicPaths.includes(pathname);
    const isAdminRoute = adminPaths.some((p) => pathname.startsWith(p));

    if (!user && !isPublic) {
      router.push("/signin");
      return;
    }

    if (user && (pathname === "/signin" || pathname === "/signup")) {
      router.push(user.role === "admin" ? "/dashboard" : "/events");
      return;
    }

    if (isAdminRoute && user && user.role !== "admin") {
      router.push("/events");
      return;
    }
  }, [user, loading, pathname, router]);

  const isAdmin = user?.role === "admin";
  const isVolunteer = user?.role === "volunteer" || user?.role === "admin";

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser, isAdmin, isVolunteer }}>
      {children}
    </AuthContext.Provider>
  );
}
