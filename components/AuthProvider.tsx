"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

/**
 * Upserts user profile data to the `profiles` table in Supabase.
 * Called on sign-up events and when a new OAuth user is detected.
 * This avoids the need for Supabase webhooks.
 */
async function upsertProfile(user: User) {
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
    const supabase = createClient();

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    }).catch((err) => {
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
    };
  }, []);

  const signOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch (e) {
      console.error("Supabase signOut error:", e);
    } finally {
      setUser(null);
      setSession(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
