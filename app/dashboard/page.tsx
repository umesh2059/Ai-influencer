"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { createClient } from "@/lib/supabase/client";
import { Sparkles } from "@/components/Icons";

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
}

export default function DashboardPage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/signin");
      return;
    }

    if (user) {
      fetchProfile();
    }
  }, [user, authLoading, router]);

  const fetchProfile = async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user!.id)
      .single();

    if (!error && data) {
      setProfile(data);
    }
    setProfileLoading(false);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030014]">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030014] relative overflow-hidden">
      {/* Ambient background */}
      <div className="absolute top-20 left-1/4 w-[500px] h-[300px] bg-purple-600/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-[400px] h-[300px] bg-pink-600/6 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <header className="border-b border-slate-900/60 bg-black/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center text-white shadow-lg shadow-purple-600/30 group-hover:scale-105 transition-transform duration-300">
              <Sparkles size={18} className="fill-white/10" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white group-hover:text-purple-300 transition-colors duration-300">
              Influencer
              <span className="text-purple-500 font-extrabold">.AI</span>
            </span>
          </a>

          <div className="flex items-center gap-4">
            {/* User avatar / info */}
            <div className="flex items-center gap-3">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name || "User"}
                  className="w-8 h-8 rounded-full border border-slate-700"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                  {(
                    profile?.full_name?.[0] ||
                    user?.email?.[0] ||
                    "U"
                  ).toUpperCase()}
                </div>
              )}
              <span className="text-sm text-slate-300 hidden sm:block">
                {profile?.full_name || user?.email}
              </span>
            </div>

            <button
              onClick={handleSignOut}
              className="py-2 px-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-sm font-medium text-slate-300 hover:text-white transition-all duration-300 cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Welcome back,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
              {profile?.full_name || user?.email?.split("@")[0] || "Creator"}
            </span>
          </h1>
          <p className="text-slate-400 text-base">
            Your AI influencer command center. Let&apos;s create something amazing.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            {
              label: "Active Personas",
              value: "0",
              change: "Create your first",
              color: "purple",
            },
            {
              label: "Posts Generated",
              value: "0",
              change: "Start generating",
              color: "pink",
            },
            {
              label: "Scheduled Posts",
              value: "0",
              change: "Set up scheduler",
              color: "blue",
            },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="glass-panel rounded-2xl border border-slate-800/80 p-6 hover:border-slate-700/80 transition-all duration-300"
            >
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2">
                {stat.label}
              </span>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-white">
                  {stat.value}
                </span>
                <span
                  className={`text-xs font-medium ${
                    stat.color === "purple"
                      ? "text-purple-400"
                      : stat.color === "pink"
                      ? "text-pink-400"
                      : "text-blue-400"
                  }`}
                >
                  {stat.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Profile Card */}
        <div className="glass-panel rounded-3xl border border-slate-800/80 p-8">
          <h2 className="text-xl font-bold text-white mb-6">Your Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-1">
                  Full Name
                </span>
                <span className="text-sm text-white">
                  {profile?.full_name || "Not set"}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-1">
                  Email
                </span>
                <span className="text-sm text-white">{profile?.email || user?.email}</span>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-1">
                  User ID
                </span>
                <span className="text-xs text-slate-400 font-mono break-all">
                  {user?.id}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-1">
                  Member Since
                </span>
                <span className="text-sm text-white">
                  {profile?.created_at
                    ? new Date(profile.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "Just now"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
