"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  signInDemo: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
  signInDemo: () => {},
});

export const useAuth = () => useContext(AuthContext);

/**
 * Upserts user profile data to the `profiles` table in Supabase.
 * Called on sign-up events and when a new OAuth user is detected.
 * This avoids the need for Supabase webhooks.
 */
async function upsertProfile(user: User) {
  if (user.id === "demo-creator-id") return;

  try {
    const supabase = createClient();
    const { error } = await supabase.from("profiles").upsert(
      {
        id: user.id,
        email: user.email,
        full_name:
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          null,
        avatar_url:
          user.user_metadata?.avatar_url ||
          user.user_metadata?.picture ||
          null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );

    if (error) {
      console.error("Error upserting profile:", error.message);
    } else {
      // Safely initialize credits if not set (does not crash if credits column is missing)
      try {
        const { data, error: selectError } = await supabase
          .from("profiles")
          .select("credits")
          .eq("id", user.id)
          .single();
        
        if (!selectError && data && (data.credits === null || data.credits === undefined)) {
          await supabase
            .from("profiles")
            .update({ credits: 300 })
            .eq("id", user.id);
        }
      } catch (creditsErr) {
        // Silently catch error if credits column doesn't exist
        console.log("Credits column not available yet in database.");
      }
    }
  } catch (err) {
    console.error("Exception in upsertProfile:", err);
  }
}

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check if demo user is active in localStorage
    if (typeof window !== "undefined") {
      const localDemo = localStorage.getItem("ai_demo_user");
      if (localDemo) {
        try {
          const parsed = JSON.parse(localDemo);
          setUser(parsed);
          setLoading(false);
          return;
        } catch (e) {
          localStorage.removeItem("ai_demo_user");
        }
      }
    }

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      if (
        reason &&
        (reason.message?.includes("Failed to fetch") ||
          reason.toString().includes("Failed to fetch") ||
          reason.message?.includes("Load failed"))
      ) {
        console.warn("Suppressed Supabase initialization network error:", reason);
        event.preventDefault();
      }
    };
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    const supabase = createClient();

    // Get initial session with a 2-second timeout safeguard so it never hangs indefinitely
    const sessionPromise = supabase.auth.getSession();
    const timeoutPromise = new Promise<{ data: { session: null } }>((resolve) =>
      setTimeout(() => resolve({ data: { session: null } }), 2000)
    );

    Promise.race([sessionPromise, timeoutPromise])
      .then(({ data: { session } }) => {
        if (session) {
          setSession(session);
          setUser(session.user);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Supabase getSession error:", err);
        setLoading(false);
      });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // When a user signs up or signs in for the first time, save their profile
        if (
          (event === "SIGNED_IN" || event === "USER_UPDATED") &&
          session?.user
        ) {
          await upsertProfile(session.user);
        }
      } catch (err) {
        console.error("Error in onAuthStateChange handler:", err);
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
    };
  }, []);

  const signInDemo = () => {
    const demoUser = {
      id: "demo-creator-id",
      email: "creator@influencer.ai",
      app_metadata: { provider: "demo" },
      user_metadata: {
        full_name: "Demo Creator",
        name: "Demo Creator",
        avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&h=400&q=80",
      },
      aud: "authenticated",
      created_at: new Date().toISOString(),
    } as unknown as User;

    if (typeof document !== "undefined") {
      document.cookie = "ai_demo_user=true; path=/; max-age=604800";
    }
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("ai_demo_user", JSON.stringify(demoUser));
    }
    setUser(demoUser);
    setLoading(false);
  };

  const signOut = async () => {
    // 1. Immediately clear local session state & cookies for instant 0ms UI transition
    setUser(null);
    setSession(null);
    setLoading(false);

    if (typeof document !== "undefined") {
      document.cookie = "ai_demo_user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem("ai_demo_user");
    }

    // 2. Perform remote Supabase signout in background without blocking
    try {
      const supabase = createClient();
      supabase.auth.signOut().catch((err) => console.warn("Supabase background signout:", err));
    } catch (e) {
      console.error("Supabase signOut error:", e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut, signInDemo }}>
      {children}
    </AuthContext.Provider>
  );
}
