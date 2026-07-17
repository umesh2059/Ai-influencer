"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { createClient } from "@/lib/supabase/client";
import {
  Sparkles,
  Calendar,
  Analytics,
  Users,
  Globe,
  Settings,
  Menu,
  Close,
  Zap,
  Cpu,
  Instagram,
  TikTok,
  YouTube,
  Twitter,
  ArrowRight,
  Check,
} from "@/components/Icons";
import InteractiveInfluencerGenerator from "@/components/InteractiveInfluencerGenerator";
import PostSchedulerSimulator from "@/components/PostSchedulerSimulator";

const INFLUENCER_PRESETS: Record<string, { portraits: string[], fullBodies: string[] }> = {
  Female: {
    portraits: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&h=600&q=80",
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&h=600&q=80",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&h=600&q=80",
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=600&h=600&q=80"
    ],
    fullBodies: [
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&h=900&q=80",
      "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&h=900&q=80",
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=600&h=900&q=80",
      "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?auto=format&fit=crop&w=600&h=900&q=80"
    ]
  },
  Male: {
    portraits: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&h=600&q=80",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&h=600&q=80",
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&h=600&q=80",
      "https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&w=600&h=600&q=80"
    ],
    fullBodies: [
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&h=900&q=80",
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&h=900&q=80",
      "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=600&h=900&q=80",
      "https://images.unsplash.com/photo-1618886614638-80e3c103d31a?auto=format&fit=crop&w=600&h=900&q=80"
    ]
  },
  "Non-Binary": {
    portraits: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&h=600&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&h=600&q=80"
    ],
    fullBodies: [
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&h=900&q=80",
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&h=900&q=80"
    ]
  },
  Custom: {
    portraits: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&h=600&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&h=600&q=80"
    ],
    fullBodies: [
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&h=900&q=80",
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&h=900&q=80"
    ]
  }
};

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  credits: number;
  created_at: string;
}

type TabType =
  | "dashboard"
  | "studio"
  | "calendar"
  | "analytics"
  | "library"
  | "accounts"
  | "settings";

export default function DashboardPage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  // Studio View State
  const [studioView, setStudioView] = useState<"landing" | "create-model" | "create-post">("landing");
  
  // Models State
  const [modelsList, setModelsList] = useState<any[]>([
    {
      id: "aria-sterling",
      name: "Aria Sterling",
      gender: "Female",
      bodyType: "Slim",
      skinTone: "Fair",
      ageRange: "Gen Z (18-24)",
      hairStyle: "Long locks",
      eyeColor: "Blue",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&h=400&q=80",
      niche: "Fashion",
      style: "Photorealistic",
      followers: "342.8K",
      posts: "148",
      engagement: "6.8%",
    },
    {
      id: "v3ra",
      name: "V3RA",
      gender: "Female",
      bodyType: "Athletic",
      skinTone: "Medium",
      ageRange: "Gen Z (18-24)",
      hairStyle: "Short crop",
      eyeColor: "Green",
      avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&h=400&q=80",
      niche: "Fashion",
      style: "Cyberpunk",
      followers: "189.4K",
      posts: "92",
      engagement: "8.4%",
    }
  ]);

  // Generated Posts State
  const [postsList, setPostsList] = useState<any[]>([
    {
      id: "post-1",
      modelName: "Aria Sterling",
      caption: "Golden hour in Virtual Milan. Wearing custom digital silk that adapts to the light. 👗🌅 #digitalfashion #metaverse",
      platform: "Instagram",
      imageUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&h=800&q=80",
      createdAt: "2 hours ago",
      status: "Published",
    },
    {
      id: "post-2",
      modelName: "V3RA",
      caption: "Chasing neon drops in Shibuya. Cyberpunk grids are ready. 🛸🦾 #cyberpunk #streetstyle",
      platform: "TikTok",
      imageUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&h=800&q=80",
      createdAt: "1 day ago",
      status: "Published",
    }
  ]);

  // Model creation form states
  const [newModelName, setNewModelName] = useState("");
  const [newModelGender, setNewModelGender] = useState("Female");
  const [newModelBodyType, setNewModelBodyType] = useState("Average");
  const [newModelSkinTone, setNewModelSkinTone] = useState("Medium");
  const [newModelAgeRange, setNewModelAgeRange] = useState("Gen Z (18-24)");
  const [newModelHairStyle, setNewModelHairStyle] = useState("Straight");
  const [newModelEyeColor, setNewModelEyeColor] = useState("Brown");
  const [formError, setFormError] = useState("");

  // Model generation preview states
  const [isGeneratingModel, setIsGeneratingModel] = useState(false);
  const [generationModelStep, setGenerationModelStep] = useState(0);
  const [generatedPortrait, setGeneratedPortrait] = useState("");
  const [generatedFullBody, setGeneratedFullBody] = useState("");
  const [hasGenerated, setHasGenerated] = useState(false);

  // Social account connection statuses (simulated state)
  const [connectedAccounts, setConnectedAccounts] = useState({
    instagram: { connected: true, handle: "@digital.model.maria", followers: "34.2K" },
    tiktok: { connected: true, handle: "@aria.sterling.ai", followers: "189K" },
    twitter: { connected: false, handle: "", followers: "0" },
    youtube: { connected: false, handle: "", followers: "0" },
  });

  // Settings State
  const [settingsName, setSettingsName] = useState("");
  const [settingsEmail, setSettingsEmail] = useState("");
  const [apiKeyOpenAI, setApiKeyOpenAI] = useState("••••••••••••••••••••••••");
  const [apiKeyMidjourney, setApiKeyMidjourney] = useState("••••••••••••••••••••••••");
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

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
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user!.id)
        .single();

      if (!error && data) {
        setProfile({
          ...data,
          credits: data.credits !== null && data.credits !== undefined ? data.credits : 300
        });
        setSettingsName(data.full_name || "");
        setSettingsEmail(data.email || user!.email || "");
      } else {
        if (error) {
          console.error("Supabase profile error:", error.message);
        }
        if (user) {
          setSettingsEmail(user.email || "");
          setProfile({
            id: user.id,
            email: user.email || "",
            full_name: user.user_metadata?.full_name || null,
            avatar_url: user.user_metadata?.avatar_url || null,
            created_at: new Date().toISOString(),
            credits: 300
          });
        }
      }
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
      if (user) {
        setSettingsEmail(user.email || "");
        setProfile({
          id: user.id,
          email: user.email || "",
          full_name: user.user_metadata?.full_name || null,
          avatar_url: user.user_metadata?.avatar_url || null,
          created_at: new Date().toISOString(),
          credits: 300
        });
      }
    } finally {
      setProfileLoading(false);
    }
  };

  const deductCredits = async (amount: number) => {
    const currentCredits = profile?.credits ?? 300;
    const newCredits = Math.max(0, currentCredits - amount);
    
    if (profile) {
      setProfile({ ...profile, credits: newCredits });
    } else {
      setProfile({
        id: user?.id || "",
        email: user?.email || "",
        full_name: user?.user_metadata?.full_name || null,
        avatar_url: null,
        created_at: new Date().toISOString(),
        credits: newCredits
      });
    }

    try {
      const supabase = createClient();
      await supabase
        .from("profiles")
        .update({ credits: newCredits })
        .eq("id", user!.id);
    } catch (err) {
      console.error("Failed to update credits in database:", err);
    }
  };

  const handleGenerateModel = async () => {
    if (!newModelName.trim()) {
      setFormError("Please enter a valid influencer name.");
      return;
    }
    
    const userCredits = profile?.credits ?? 300;
    if (userCredits < 50) {
      setFormError("Insufficient credits. You need at least 50 credits to generate a model.");
      return;
    }

    setFormError("");
    setIsGeneratingModel(true);
    setHasGenerated(false);
    setGenerationModelStep(0);

    // Simulate step progress
    for (let i = 0; i < 5; i++) {
      await new Promise((resolve) => setTimeout(resolve, 600));
      setGenerationModelStep(i);
    }

    const genderKey = (newModelGender === "Female" || newModelGender === "Male" || newModelGender === "Non-Binary")
      ? newModelGender
      : "Custom";

    const presets = INFLUENCER_PRESETS[genderKey] || INFLUENCER_PRESETS.Custom;
    const randomPortrait = presets.portraits[Math.floor(Math.random() * presets.portraits.length)];
    const randomFullBody = presets.fullBodies[Math.floor(Math.random() * presets.fullBodies.length)];

    setGeneratedPortrait(randomPortrait);
    setGeneratedFullBody(randomFullBody);
    await deductCredits(50);
    setHasGenerated(true);
    setIsGeneratingModel(false);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const saveProfileSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    const supabase = createClient();

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: settingsName,
      })
      .eq("id", user!.id);

    if (!error) {
      setProfile((prev) => (prev ? { ...prev, full_name: settingsName } : null));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
    setIsSavingSettings(false);
  };

  const [showResetButton, setShowResetButton] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (authLoading || profileLoading) {
        setShowResetButton(true);
      }
    }, 3500);
    return () => clearTimeout(timer);
  }, [authLoading, profileLoading]);

  const handleClearSession = () => {
    try {
      localStorage.clear();
      // Clear cookies
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
      window.location.href = "/";
    } catch (e) {
      console.error(e);
    }
  };

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#030014] text-center px-4">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mb-4" />
        {showResetButton && (
          <div className="animate-fadeIn space-y-3 max-w-sm">
            <p className="text-sm text-slate-400">
              Taking longer than expected? An invalid session from a previous project might be active in your browser cache.
            </p>
            <button
              onClick={handleClearSession}
              className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-purple-400 hover:text-white hover:border-slate-700 transition-all duration-300 cursor-pointer"
            >
              Reset Session Cache & Reload
            </button>
          </div>
        )}
      </div>
    );
  }

  // Sidebar items
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Cpu },
    { id: "studio", label: "Models / Studio", icon: Sparkles },
    { id: "calendar", label: "Calendar", icon: Calendar },
    { id: "analytics", label: "Analytics", icon: Analytics },
    { id: "library", label: "Content Library", icon: Globe },
    { id: "accounts", label: "Accounts", icon: Users },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#030014] text-white flex flex-col md:flex-row relative overflow-hidden">
      {/* Ambient backgrounds */}
      <div className="absolute top-20 left-1/4 w-[500px] h-[300px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-[400px] h-[300px] bg-pink-600/4 rounded-full blur-[100px] pointer-events-none" />

      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between px-6 py-4 bg-black/40 border-b border-slate-900/60 backdrop-blur-md z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center text-white">
            <Sparkles size={16} className="fill-white/10" />
          </div>
          <span className="font-bold text-lg tracking-tight">
            Influencer<span className="text-purple-500 font-extrabold">.AI</span>
          </span>
        </div>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 text-slate-400 hover:text-white rounded-lg bg-slate-900/50 border border-slate-800"
        >
          {isSidebarOpen ? <Close size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-black/50 border-r border-slate-900/80 backdrop-blur-xl z-50 transform transition-transform duration-300 md:relative md:translate-x-0 flex flex-col justify-between ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Logo Section */}
          <div className="p-6 hidden md:flex items-center gap-2 border-b border-slate-900/60">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center text-white shadow-lg shadow-purple-600/30">
              <Sparkles size={18} className="fill-white/10" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">
              Influencer<span className="text-purple-500 font-extrabold">.AI</span>
            </span>
          </div>

          <div className="p-6 md:hidden flex justify-between items-center border-b border-slate-900/60">
            <span className="font-bold text-lg tracking-tight text-white">Menu</span>
            <button onClick={() => setIsSidebarOpen(false)} className="text-slate-400">
              <Close size={20} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as TabType);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "bg-gradient-to-r from-purple-600/20 to-pink-600/10 text-white border border-purple-500/20 shadow-md shadow-purple-950/10"
                      : "text-slate-400 hover:text-white hover:bg-slate-900/30 border border-transparent"
                  }`}
                >
                  <Icon size={18} className={isActive ? "text-purple-400" : ""} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User profile footer */}
        <div className="p-4 border-t border-slate-900/60 bg-black/20">
          <div className="flex items-center gap-3 mb-4">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.full_name || "User"}
                className="w-9 h-9 rounded-full border border-slate-800"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold">
                {(profile?.full_name?.[0] || user?.email?.[0] || "U").toUpperCase()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">
                {profile?.full_name || user?.email?.split("@")[0]}
              </p>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full py-2 px-4 rounded-xl bg-slate-900 border border-slate-800/80 hover:border-slate-700 text-xs font-semibold text-slate-400 hover:text-white transition-all duration-300 cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto px-6 py-8 md:p-8 z-10">
        {/* Dynamic Tab Rendering */}
        {activeTab === "dashboard" && (
          <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn">
            {/* Top Row: Welcome & Platform Summary */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight">
                  Welcome back,{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                    {profile?.full_name || user?.email?.split("@")[0] || "Creator"}
                  </span>
                </h1>
                <p className="text-slate-400 text-sm mt-1">
                  Everything looks good today. You have generated 3 synthetic posts this week.
                </p>
              </div>
              <button
                onClick={() => setActiveTab("studio")}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-sm font-semibold text-white shadow-lg shadow-purple-600/20 hover:shadow-purple-600/35 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center gap-2 cursor-pointer"
              >
                <Sparkles size={16} />
                Generate Model
              </button>
            </div>

            {/* Quick stats cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  label: "Total Reach",
                  value: "223.2K",
                  change: "+12.4% this month",
                  color: "purple",
                },
                {
                  label: "Active Personas",
                  value: "2",
                  change: "Aria & V3RA active",
                  color: "pink",
                },
                {
                  label: "Scheduled Posts",
                  value: "5",
                  change: "Next post at 02:15 PM",
                  color: "blue",
                },
                {
                  label: "Avg. Engagement",
                  value: "9.2%",
                  change: "+1.8% vs industry",
                  color: "green",
                },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950/40 border border-slate-900/80 rounded-2xl p-6 hover:border-slate-800 transition-all duration-300 relative group overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2">
                    {stat.label}
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black">{stat.value}</span>
                  </div>
                  <span
                    className={`text-xs font-semibold mt-2 block ${
                      stat.color === "purple"
                        ? "text-purple-400"
                        : stat.color === "pink"
                        ? "text-pink-400"
                        : stat.color === "blue"
                        ? "text-blue-400"
                        : "text-emerald-400"
                    }`}
                  >
                    {stat.change}
                  </span>
                </div>
              ))}
            </div>

            {/* Action Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Active Influencers Mini List */}
              <div className="bg-slate-950/40 border border-slate-900/80 rounded-2xl p-6 space-y-4 lg:col-span-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold">Active Digital Personas</h3>
                  <button
                    onClick={() => setActiveTab("studio")}
                    className="text-xs text-purple-400 hover:text-purple-300 font-semibold"
                  >
                    Manage Studio
                  </button>
                </div>

                <div className="divide-y divide-slate-900/50">
                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80"
                        alt="Aria Sterling"
                        className="w-11 h-11 rounded-xl border border-slate-800 object-cover"
                      />
                      <div>
                        <h4 className="font-semibold text-sm">Aria Sterling</h4>
                        <span className="text-xs text-slate-500">Fashion | Photorealistic</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">342.8K</p>
                      <span className="text-xs text-emerald-400">6.8% Engagement</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&h=80&q=80"
                        alt="V3RA"
                        className="w-11 h-11 rounded-xl border border-slate-800 object-cover"
                      />
                      <div>
                        <h4 className="font-semibold text-sm">V3RA</h4>
                        <span className="text-xs text-slate-500">Streetwear | Cyberpunk</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">189.4K</p>
                      <span className="text-xs text-emerald-400">8.4% Engagement</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Channels Connection Summary */}
              <div className="bg-slate-950/40 border border-slate-900/80 rounded-2xl p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold">Connected Channels</h3>
                  <button
                    onClick={() => setActiveTab("accounts")}
                    className="text-xs text-purple-400 hover:text-purple-300 font-semibold"
                  >
                    Manage
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/30 border border-slate-900/80">
                    <div className="flex items-center gap-3">
                      <Instagram size={18} className="text-pink-500" />
                      <span className="text-sm font-medium">Instagram</span>
                    </div>
                    <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                      <Check size={12} /> Active
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/30 border border-slate-900/80">
                    <div className="flex items-center gap-3">
                      <TikTok size={18} className="text-white" />
                      <span className="text-sm font-medium">TikTok</span>
                    </div>
                    <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                      <Check size={12} /> Active
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/10 border border-slate-900/50 opacity-55">
                    <div className="flex items-center gap-3">
                      <Twitter size={18} className="text-sky-400" />
                      <span className="text-sm font-medium text-slate-500">Twitter</span>
                    </div>
                    <span className="text-xs text-slate-500">Disconnected</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="font-bold text-base flex items-center gap-2">
                  <Zap size={16} className="text-purple-400 animate-pulse" />
                  Ready to publish?
                </h4>
                <p className="text-xs text-slate-400">
                  Simulate your digital model's social media scheduler to optimize your post times.
                </p>
              </div>
              <button
                onClick={() => setActiveTab("calendar")}
                className="py-2 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold transition-all duration-300 flex items-center gap-1.5 cursor-pointer"
              >
                Go to Scheduler <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {activeTab === "studio" && (
          <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn">
            {studioView === "landing" && (
              <div className="space-y-8">
                {/* Header with credits */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-extrabold tracking-tight font-sans">AI Model Studio</h1>
                    <p className="text-slate-400 text-sm mt-1">
                      Manage your custom artificial personas and generate rich content for social channels.
                    </p>
                  </div>
                  {/* Credits Badge */}
                  <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-500/15 to-pink-500/10 border border-purple-500/20 text-purple-400 font-bold text-sm shadow-md shadow-purple-950/30">
                    <span className="animate-pulse text-purple-400 text-base">✨</span>
                    <span>{profile?.credits ?? 300} Credits</span>
                  </div>
                </div>

                {/* Two Option Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Option 1: Add New Model */}
                  <div
                    onClick={() => setStudioView("create-model")}
                    className="group bg-slate-950/40 border border-slate-900/80 hover:border-purple-500/50 hover:bg-slate-950/60 rounded-3xl p-6 transition-all duration-300 cursor-pointer relative overflow-hidden flex flex-col justify-between min-h-[220px]"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 rounded-full blur-2xl group-hover:bg-purple-600/15 transition-all duration-300" />
                    <div className="space-y-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-600/30">
                        {/* User Plus SVG Icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <line x1="19" x2="19" y1="8" y2="14" />
                          <line x1="22" x2="16" y1="11" y2="11" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">Add New Model</h3>
                        <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                          Define a brand new AI influencer identity. Configure their name, gender, body type, age range, hair, and eye color.
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-purple-400 group-hover:text-purple-300">
                      Configure Model <ArrowRight size={14} />
                    </div>
                  </div>

                  {/* Option 2: Create a Post */}
                  <div
                    onClick={() => setStudioView("create-post")}
                    className="group bg-slate-950/40 border border-slate-900/80 hover:border-pink-500/50 hover:bg-slate-950/60 rounded-3xl p-6 transition-all duration-300 cursor-pointer relative overflow-hidden flex flex-col justify-between min-h-[220px]"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-pink-600/10 rounded-full blur-2xl group-hover:bg-pink-600/15 transition-all duration-300" />
                    <div className="space-y-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-600 to-rose-600 flex items-center justify-center text-white shadow-lg shadow-pink-600/30">
                        {/* Plus Circle Image SVG Icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                          <circle cx="9" cy="9" r="2" />
                          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-pink-400 transition-colors">Create a Post</h3>
                        <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                          Synthesize fresh visual content and write engaging, target-optimized captions for your virtual models.
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-pink-400 group-hover:text-pink-300">
                      Open Post Generator <ArrowRight size={14} />
                    </div>
                  </div>
                </div>

                {/* Below sections: Model list & Post generated */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left Column: Model List Directory */}
                  <div className="lg:col-span-2 space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h2 className="text-lg font-bold text-white">Active Personas Directory</h2>
                        <p className="text-slate-500 text-xs">Total models available for generation: {modelsList.length}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {modelsList.map((model) => (
                        <div
                          key={model.id}
                          className="bg-slate-950/30 border border-slate-900 rounded-2xl p-5 hover:border-slate-800 transition-all duration-300 flex flex-col justify-between space-y-4 relative group"
                        >
                          <div className="flex items-start gap-4">
                            {model.avatarUrl ? (
                              <img
                                src={model.avatarUrl}
                                alt={model.name}
                                className="w-14 h-14 rounded-2xl object-cover border border-slate-800 shadow-md shadow-black/40"
                              />
                            ) : (
                              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white text-lg font-bold border border-slate-800">
                                {model.name[0]}
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-base text-white truncate">{model.name}</h3>
                              <p className="text-xs text-purple-400 font-medium">
                                {model.niche || "Fashion"} | {model.style || "Photorealistic"}
                              </p>
                              {model.followers && (
                                <p className="text-[11px] text-slate-500 mt-1">
                                  {model.followers} followers • {model.engagement} engagement
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-900/60">
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 text-slate-400 border border-slate-800/60">
                              Gender: {model.gender}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 text-slate-400 border border-slate-800/60">
                              Body: {model.bodyType}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 text-slate-400 border border-slate-800/60">
                              Skin: {model.skinTone}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 text-slate-400 border border-slate-800/60">
                              Age: {model.ageRange}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 text-slate-400 border border-slate-800/60">
                              Hair: {model.hairStyle}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 text-slate-400 border border-slate-800/60">
                              Eye: {model.eyeColor}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Generated Posts */}
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-lg font-bold text-white">Latest Generated Content</h2>
                      <p className="text-slate-500 text-xs">Simulated and active social feeds</p>
                    </div>

                    <div className="space-y-4">
                      {postsList.map((post) => (
                        <div
                          key={post.id}
                          className="bg-slate-950/30 border border-slate-900 rounded-2xl overflow-hidden hover:border-slate-800 transition-all duration-300"
                        >
                          <div className="aspect-video w-full relative">
                            <img src={post.imageUrl} alt="Post content" className="w-full h-full object-cover" />
                            <span className="absolute top-3 left-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-purple-400 border border-purple-500/20">
                              {post.modelName}
                            </span>
                            <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-white">
                              {post.platform}
                            </span>
                          </div>
                          <div className="p-4 space-y-2">
                            <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{post.caption}</p>
                            <div className="flex justify-between items-center pt-2 text-[10px] text-slate-500 border-t border-slate-900/50">
                              <span>{post.createdAt}</span>
                              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                                <Check size={10} /> {post.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {studioView === "create-model" && (
              <div className="space-y-6">
                {/* Breadcrumb / Back button */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => {
                      setStudioView("landing");
                      setFormError("");
                      setHasGenerated(false);
                      setGeneratedPortrait("");
                      setGeneratedFullBody("");
                    }}
                    className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors cursor-pointer font-medium"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="19" x2="5" y1="12" y2="12" />
                      <polyline points="12 19 5 12 12 5" />
                    </svg>
                    Back to Studio Hub
                  </button>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-purple-400 font-bold bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
                      Cost: 50 Credits
                    </span>
                    <span className="text-xs text-slate-500 font-medium">Balance: {profile?.credits ?? 300} Credits</span>
                  </div>
                </div>

                {/* Split layout: Options on left, Preview on right (Dribbble UX) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left Column: Properties custom tiles (8 cols) */}
                  <div className="lg:col-span-7 bg-slate-950/40 border border-slate-900/85 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden">
                    <div>
                      <h2 className="text-xl font-bold text-white">Configure Persona Attributes</h2>
                      <p className="text-slate-400 text-xs mt-1">Select visual attributes to formulate consistent influencer portraits and postures.</p>
                    </div>

                    {formError && (
                      <div className="p-4 rounded-xl bg-red-950/30 border border-red-500/20 text-red-400 text-xs animate-shake">
                        {formError}
                      </div>
                    )}

                    <div className="space-y-6">
                      {/* Name input */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Influencer Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Mia Woods"
                          value={newModelName}
                          onChange={(e) => setNewModelName(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800/80 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-purple-500/50 transition-colors"
                        />
                      </div>

                      {/* Gender Selector Chips */}
                      <div className="space-y-3">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Gender Selection</label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {[
                            { value: "Female", label: "👩 Female", style: "border-pink-500/20 hover:border-pink-500/40 selected:bg-pink-500/20 active-ring:ring-pink-500/50" },
                            { value: "Male", label: "👨 Male", style: "border-blue-500/20 hover:border-blue-500/40 selected:bg-blue-500/20 active-ring:ring-blue-500/50" },
                            { value: "Non-Binary", label: "🧑 Non-Binary", style: "border-purple-500/20 hover:border-purple-500/40 selected:bg-purple-500/20 active-ring:ring-purple-500/50" },
                            { value: "Custom", label: "🌈 Custom", style: "border-amber-500/20 hover:border-amber-500/40 selected:bg-amber-500/20 active-ring:ring-amber-500/50" },
                          ].map((gender) => {
                            const isSel = newModelGender === gender.value;
                            return (
                              <button
                                key={gender.value}
                                onClick={() => setNewModelGender(gender.value)}
                                className={`px-4 py-3 rounded-xl border text-xs font-bold transition-all duration-300 cursor-pointer text-center ${
                                  isSel
                                    ? "bg-gradient-to-b from-purple-900/30 to-purple-600/10 border-purple-500 shadow-lg shadow-purple-950/20 text-white"
                                    : "bg-slate-950/40 border-slate-900 text-slate-400 hover:text-white"
                                }`}
                              >
                                {gender.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Body Type Selection Chips */}
                      <div className="space-y-3">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Body Anatomy</label>
                        <div className="flex flex-wrap gap-2.5">
                          {[
                            { value: "Slim", label: "⏳ Slim" },
                            { value: "Athletic", label: "⚡ Athletic" },
                            { value: "Curvy", label: "🍑 Curvy" },
                            { value: "Muscular", label: "💪 Muscular" },
                            { value: "Average", label: "🧍 Average" },
                          ].map((b) => {
                            const isSel = newModelBodyType === b.value;
                            return (
                              <button
                                key={b.value}
                                onClick={() => setNewModelBodyType(b.value)}
                                className={`px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all duration-300 cursor-pointer ${
                                  isSel
                                    ? "bg-purple-500/10 border-purple-500 text-white shadow-md"
                                    : "bg-slate-950/40 border-slate-900 text-slate-400 hover:text-white hover:border-slate-800"
                                }`}
                              >
                                {b.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Skin Tone Selection Chips */}
                      <div className="space-y-3">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Skin Tone & Complexion</label>
                        <div className="flex flex-wrap gap-2">
                          {[
                            { value: "Fair", label: "🏻 Fair" },
                            { value: "Light", label: "🏼 Light" },
                            { value: "Medium", label: "🏽 Medium" },
                            { value: "Olive", label: "🏾 Olive" },
                            { value: "Dark", label: "🏿 Dark" },
                            { value: "Deep Dark", label: "🏿 Deep Dark" },
                          ].map((skin) => {
                            const isSel = newModelSkinTone === skin.value;
                            return (
                              <button
                                key={skin.value}
                                onClick={() => setNewModelSkinTone(skin.value)}
                                className={`px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${
                                  isSel
                                    ? "bg-purple-500/10 border-purple-500 text-white"
                                    : "bg-slate-950/40 border-slate-900 text-slate-400 hover:text-white hover:border-slate-800"
                                }`}
                              >
                                <span>{skin.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Age Range Chips */}
                      <div className="space-y-3">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Age Range</label>
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { value: "Gen Z (18-24)", label: "🎒 Gen Z (18-24)" },
                            { value: "Millennial (25-34)", label: "💼 Millennial (25-34)" },
                            { value: "Mid-Career (35-44)", label: "👔 Mid-Career (35-44)" },
                            { value: "Mature (45+)", label: "🕶️ Mature (45+)" },
                          ].map((age) => {
                            const isSel = newModelAgeRange === age.value;
                            return (
                              <button
                                key={age.value}
                                onClick={() => setNewModelAgeRange(age.value)}
                                className={`px-4 py-3 rounded-xl border text-xs font-semibold transition-all duration-300 cursor-pointer text-left ${
                                  isSel
                                    ? "bg-purple-500/10 border-purple-500 text-white"
                                    : "bg-slate-950/40 border-slate-900 text-slate-400 hover:text-white hover:border-slate-800"
                                }`}
                              >
                                {age.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Hair Style Selector */}
                      <div className="space-y-3">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Hair Style</label>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { value: "Straight", label: "👩 Straight" },
                            { value: "Wavy", label: "👩‍🦱 Wavy" },
                            { value: "Curly", label: "👩‍🦱 Curly" },
                            { value: "Coily", label: "👩‍🦱 Coily" },
                            { value: "Pixie", label: "💇‍♀️ Pixie" },
                            { value: "Short crop", label: "💇‍♂️ Short" },
                            { value: "Long locks", label: "👱‍♀️ Long locks" },
                            { value: "Braids", label: "👩‍🦱 Braids" },
                            { value: "Bald", label: "👨‍🦲 Bald" },
                          ].map((h) => {
                            const isSel = newModelHairStyle === h.value;
                            return (
                              <button
                                key={h.value}
                                onClick={() => setNewModelHairStyle(h.value)}
                                className={`px-3 py-2.5 rounded-xl border text-[11px] font-semibold transition-all duration-300 cursor-pointer text-center truncate ${
                                  isSel
                                    ? "bg-purple-500/10 border-purple-500 text-white"
                                    : "bg-slate-950/40 border-slate-900 text-slate-400 hover:text-white hover:border-slate-800"
                                }`}
                              >
                                {h.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Eye Color */}
                      <div className="space-y-3">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Eye Color</label>
                        <div className="flex flex-wrap gap-2.5">
                          {[
                            { value: "Blue", label: "🔵 Blue" },
                            { value: "Green", label: "🟢 Green" },
                            { value: "Brown", label: "🟤 Brown" },
                            { value: "Hazel", label: "🟡 Hazel" },
                            { value: "Gray", label: "⚪ Gray" },
                            { value: "Amber", label: "🟠 Amber" },
                          ].map((eye) => {
                            const isSel = newModelEyeColor === eye.value;
                            return (
                              <button
                                key={eye.value}
                                onClick={() => setNewModelEyeColor(eye.value)}
                                className={`px-3.5 py-2.5 rounded-xl border text-xs font-semibold transition-all duration-300 cursor-pointer ${
                                  isSel
                                    ? "bg-purple-500/10 border-purple-500 text-white"
                                    : "bg-slate-950/40 border-slate-900 text-slate-400 hover:text-white hover:border-slate-800"
                                }`}
                              >
                                {eye.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-900/80 flex justify-end">
                      <button
                        onClick={handleGenerateModel}
                        disabled={isGeneratingModel}
                        className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-[1.02] active:scale-[0.98] disabled:scale-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-sm font-semibold text-white shadow-lg shadow-purple-600/20 hover:shadow-purple-600/35 cursor-pointer flex items-center gap-2"
                      >
                        <Sparkles size={16} /> Generate Model (-50 Credits)
                      </button>
                    </div>
                  </div>

                  {/* Right Column: Visual Preview Panel (5 cols) */}
                  <div className="lg:col-span-5 flex flex-col justify-stretch">
                    <div className="flex-1 bg-slate-950/40 border border-slate-900/85 rounded-3xl p-6 shadow-2xl flex flex-col items-center justify-center min-h-[400px] relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-600/5 via-transparent to-pink-600/5 pointer-events-none" />

                      {isGeneratingModel ? (
                        /* Simulated step generation screen */
                        <div className="space-y-6 text-center max-w-xs z-10">
                          <div className="relative w-20 h-20 mx-auto">
                            {/* Outer animated spinner */}
                            <div className="absolute inset-0 rounded-full border-2 border-purple-500/10 border-t-purple-500 animate-spin" />
                            {/* Inner pulse */}
                            <div className="absolute inset-2 rounded-full bg-purple-500/10 flex items-center justify-center animate-pulse">
                              <Sparkles size={24} className="text-purple-400" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <h4 className="font-bold text-white text-base">Synthesizing Persona</h4>
                            <p className="text-xs text-purple-400 font-semibold h-4 transition-all duration-300">
                              {[
                                "Formulating facial topology mapping...",
                                "Calibrating diffuse and specular lighting...",
                                "Synthesizing skin shaders & pigmentation...",
                                "Constructing posture & matching viewport...",
                                "Finalizing high-fidelity rendering..."
                              ][generationModelStep]}
                            </p>
                          </div>
                          {/* Progress bar */}
                          <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                              style={{ width: `${(generationModelStep + 1) * 20}%` }}
                            />
                          </div>
                        </div>
                      ) : hasGenerated ? (
                        /* Side-by-side Dribbble preview screen */
                        <div className="w-full space-y-6 z-10 animate-scaleUp">
                          <div>
                            <span className="text-[9px] font-bold uppercase tracking-widest text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20">
                              Generation Success
                            </span>
                            <h3 className="text-lg font-black text-white mt-2.5">{newModelName || "Generated Model"}</h3>
                            <p className="text-slate-500 text-xs mt-0.5">{newModelGender} | {newModelAgeRange}</p>
                          </div>

                          {/* Dual image preview */}
                          <div className="grid grid-cols-2 gap-4">
                            {/* Portrait Face image */}
                            <div className="space-y-2">
                              <span className="text-[10px] font-bold text-slate-400 block text-center uppercase tracking-wider">Portrait Face</span>
                              <div className="aspect-[4/5] rounded-2xl overflow-hidden border border-purple-500/25 relative group shadow-lg shadow-black/60">
                                <img src={generatedPortrait} alt="Portrait Face preview" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-3">
                                  <span className="text-[10px] text-white font-medium">Consistent Face mesh</span>
                                </div>
                              </div>
                            </div>

                            {/* Full body image */}
                            <div className="space-y-2">
                              <span className="text-[10px] font-bold text-slate-400 block text-center uppercase tracking-wider">Full Body Pose</span>
                              <div className="aspect-[4/5] rounded-2xl overflow-hidden border border-pink-500/25 relative group shadow-lg shadow-black/60">
                                <img src={generatedFullBody} alt="Full body pose preview" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-3">
                                  <span className="text-[10px] text-white font-medium">Consistent Body rigging</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Quick details tags summary */}
                          <div className="bg-slate-950/60 rounded-xl p-3.5 border border-slate-900 space-y-1 text-slate-400 text-xs">
                            <div className="flex justify-between"><span className="text-slate-500">Gender:</span> <span className="text-slate-300 font-bold">{newModelGender}</span></div>
                            <div className="flex justify-between"><span className="text-slate-500">Body Type:</span> <span className="text-slate-300 font-bold">{newModelBodyType}</span></div>
                            <div className="flex justify-between"><span className="text-slate-500">Skin Tone:</span> <span className="text-slate-300 font-bold">{newModelSkinTone}</span></div>
                            <div className="flex justify-between"><span className="text-slate-500">Hair Style:</span> <span className="text-slate-300 font-bold">{newModelHairStyle}</span></div>
                            <div className="flex justify-between"><span className="text-slate-500">Eye Color:</span> <span className="text-slate-300 font-bold">{newModelEyeColor}</span></div>
                          </div>

                          {/* Roster save buttons */}
                          <div className="flex gap-3">
                            <button
                              onClick={() => {
                                const newModel = {
                                  id: `model-${Date.now()}`,
                                  name: newModelName,
                                  gender: newModelGender,
                                  bodyType: newModelBodyType,
                                  skinTone: newModelSkinTone,
                                  ageRange: newModelAgeRange,
                                  hairStyle: newModelHairStyle,
                                  eyeColor: newModelEyeColor,
                                  avatarUrl: generatedPortrait,
                                  niche: "Fashion",
                                  style: "Photorealistic",
                                  followers: "0",
                                  posts: "0",
                                  engagement: "0.0%",
                                };

                                setModelsList([newModel, ...modelsList]);
                                setNewModelName("");
                                setStudioView("landing");
                                setHasGenerated(false);
                                setGeneratedPortrait("");
                                setGeneratedFullBody("");
                              }}
                              className="flex-1 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 active:scale-[0.98] transition-all duration-300 text-xs font-bold text-white shadow-lg shadow-purple-600/25 cursor-pointer text-center"
                            >
                              Add to Active Directory
                            </button>
                            <button
                              onClick={() => {
                                setHasGenerated(false);
                                setGeneratedPortrait("");
                                setGeneratedFullBody("");
                              }}
                              className="py-3.5 px-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 active:scale-[0.98] transition-all duration-300 text-xs font-bold text-slate-400 hover:text-white cursor-pointer text-center"
                            >
                              Discard
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* Pre-generation instruction placeholder */
                        <div className="text-center space-y-4 max-w-xs z-10">
                          <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-slate-900/80 flex items-center justify-center mx-auto text-slate-600 shadow-md">
                            <Sparkles size={20} />
                          </div>
                          <div>
                            <h4 className="font-bold text-white text-sm">Visual Preview Console</h4>
                            <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                              Configure attributes on the left and trigger generation to render matching facial models and full body compositions.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {studioView === "create-post" && (
              <div className="space-y-6">
                {/* Back button */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setStudioView("landing")}
                    className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors cursor-pointer font-medium"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="19" x2="5" y1="12" y2="12" />
                      <polyline points="12 19 5 12 12 5" />
                    </svg>
                    Back to Studio Hub
                  </button>
                  <span className="text-xs text-slate-500 font-medium">Post Synthesis Console</span>
                </div>

                <div className="glass-panel border border-slate-900/80 rounded-3xl overflow-hidden shadow-2xl">
                  <InteractiveInfluencerGenerator />
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "calendar" && (
          <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Content Scheduler</h1>
              <p className="text-slate-400 text-sm">
                Plan and simulate social media posts for your artificial personas.
              </p>
            </div>
            <div className="glass-panel border border-slate-900/80 rounded-3xl overflow-hidden shadow-2xl">
              <PostSchedulerSimulator />
            </div>
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Analytics Dashboard</h1>
              <p className="text-slate-400 text-sm">
                Measure reach, growth rate, and audience demographics across your personas.
              </p>
            </div>

            {/* Metrics cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: "Aggregate Impressions", value: "1.42M", change: "+18.2% vs last month" },
                { label: "Audience Growth", value: "+14.8K", change: "223.2K total followers" },
                { label: "Sponsor Ad CTR", value: "3.4%", change: "Industry average: 1.1%" },
              ].map((m, idx) => (
                <div key={idx} className="bg-slate-950/40 border border-slate-900/80 rounded-2xl p-6">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-1">
                    {m.label}
                  </span>
                  <p className="text-3xl font-extrabold mb-1">{m.value}</p>
                  <span className="text-xs text-emerald-400 font-semibold">{m.change}</span>
                </div>
              ))}
            </div>

            {/* Performance charts mock */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-950/40 border border-slate-900/80 rounded-2xl p-6 space-y-4">
                <h3 className="text-lg font-bold">Follower Growth (30 Days)</h3>
                <div className="h-64 flex items-end justify-between gap-2 pt-6">
                  {[20, 25, 23, 30, 42, 50, 48, 55, 62, 70, 85, 98].map((val, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                      <div
                        className="w-full bg-gradient-to-t from-purple-600 to-pink-500 rounded-t-md hover:from-purple-500 hover:to-pink-400 transition-all duration-300 relative"
                        style={{ height: `${val}%` }}
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-[10px] px-1.5 py-0.5 rounded border border-slate-800 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                          {(val * 2.2).toFixed(1)}k
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-500">M{idx + 1}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-950/40 border border-slate-900/80 rounded-2xl p-6 space-y-4">
                <h3 className="text-lg font-bold">Audience Demographics</h3>
                <div className="space-y-4 pt-4">
                  {[
                    { group: "18-24 years", percentage: 48, color: "bg-purple-500" },
                    { group: "25-34 years", percentage: 32, color: "bg-pink-500" },
                    { group: "35-44 years", percentage: 12, color: "bg-blue-500" },
                    { group: "Other", percentage: 8, color: "bg-slate-700" },
                  ].map((demo, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-400">{demo.group}</span>
                        <span>{demo.percentage}%</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden">
                        <div className={`h-full ${demo.color}`} style={{ width: `${demo.percentage}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "library" && (
          <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Content Library</h1>
              <p className="text-slate-400 text-sm">
                Explore, select, and export your generated artificial media catalog.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&h=800&q=80",
                "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&h=800&q=80",
                "https://images.unsplash.com/photo-1560942485-b2a11cc13456?auto=format&fit=crop&w=600&h=800&q=80",
                "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&h=800&q=80",
                "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&h=800&q=80",
                "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=600&h=800&q=80",
                "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&h=800&q=80",
                "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&h=800&q=80",
              ].map((url, idx) => (
                <div
                  key={idx}
                  className="group relative aspect-square rounded-2xl overflow-hidden border border-slate-900 bg-slate-950/80 hover:border-purple-500/50 transition-all duration-300 cursor-pointer"
                >
                  <img
                    src={url}
                    alt={`Asset ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <span className="text-[10px] font-bold text-purple-400 uppercase">Aria Sterling</span>
                    <p className="text-xs text-white truncate font-medium">Render #{1000 + idx}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "accounts" && (
          <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Social Accounts</h1>
              <p className="text-slate-400 text-sm">
                Link and manage your target channels to deploy content directly.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Instagram Card */}
              <div className="p-6 rounded-2xl bg-slate-950/40 border border-slate-900/80 flex flex-col justify-between h-48">
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-500">
                      <Instagram size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-base">Instagram</h3>
                      {connectedAccounts.instagram.connected ? (
                        <p className="text-xs text-purple-400 font-medium">
                          {connectedAccounts.instagram.handle}
                        </p>
                      ) : (
                        <p className="text-xs text-slate-500 font-medium">Not Connected</p>
                      )}
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                      connectedAccounts.instagram.connected
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-slate-900 text-slate-400 border border-slate-800"
                    }`}
                  >
                    {connectedAccounts.instagram.connected ? "Linked" : "Offline"}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-slate-900/50">
                  <span className="text-xs text-slate-500">
                    {connectedAccounts.instagram.connected
                      ? `${connectedAccounts.instagram.followers} Followers`
                      : "No info"}
                  </span>
                  <button
                    onClick={() =>
                      setConnectedAccounts((prev) => ({
                        ...prev,
                        instagram: { ...prev.instagram, connected: !prev.instagram.connected },
                      }))
                    }
                    className="py-1.5 px-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-semibold hover:text-white transition-all duration-300 cursor-pointer"
                  >
                    {connectedAccounts.instagram.connected ? "Disconnect" : "Connect Account"}
                  </button>
                </div>
              </div>

              {/* TikTok Card */}
              <div className="p-6 rounded-2xl bg-slate-950/40 border border-slate-900/80 flex flex-col justify-between h-48">
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
                      <TikTok size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-base">TikTok</h3>
                      {connectedAccounts.tiktok.connected ? (
                        <p className="text-xs text-purple-400 font-medium">
                          {connectedAccounts.tiktok.handle}
                        </p>
                      ) : (
                        <p className="text-xs text-slate-500 font-medium">Not Connected</p>
                      )}
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                      connectedAccounts.tiktok.connected
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-slate-900 text-slate-400 border border-slate-800"
                    }`}
                  >
                    {connectedAccounts.tiktok.connected ? "Linked" : "Offline"}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-slate-900/50">
                  <span className="text-xs text-slate-500">
                    {connectedAccounts.tiktok.connected
                      ? `${connectedAccounts.tiktok.followers} Followers`
                      : "No info"}
                  </span>
                  <button
                    onClick={() =>
                      setConnectedAccounts((prev) => ({
                        ...prev,
                        tiktok: { ...prev.tiktok, connected: !prev.tiktok.connected },
                      }))
                    }
                    className="py-1.5 px-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-semibold hover:text-white transition-all duration-300 cursor-pointer"
                  >
                    {connectedAccounts.tiktok.connected ? "Disconnect" : "Connect Account"}
                  </button>
                </div>
              </div>

              {/* YouTube Card */}
              <div className="p-6 rounded-2xl bg-slate-950/40 border border-slate-900/80 flex flex-col justify-between h-48 opacity-75 hover:opacity-100 transition-opacity duration-300">
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-red-600/10 border border-red-600/20 flex items-center justify-center text-red-500">
                      <YouTube size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-base">YouTube Shorts</h3>
                      <p className="text-xs text-slate-500 font-medium">Not Connected</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider bg-slate-900 text-slate-400 border border-slate-800">
                    Offline
                  </span>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-slate-900/50">
                  <span className="text-xs text-slate-500">No Channel Linked</span>
                  <button className="py-1.5 px-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-semibold hover:text-white transition-all duration-300 cursor-pointer">
                    Connect Channel
                  </button>
                </div>
              </div>

              {/* Twitter Card */}
              <div className="p-6 rounded-2xl bg-slate-950/40 border border-slate-900/80 flex flex-col justify-between h-48 opacity-75 hover:opacity-100 transition-opacity duration-300">
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                      <Twitter size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-base">Twitter / X</h3>
                      <p className="text-xs text-slate-500 font-medium">Not Connected</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider bg-slate-900 text-slate-400 border border-slate-800">
                    Offline
                  </span>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-slate-900/50">
                  <span className="text-xs text-slate-500">No Handle Linked</span>
                  <button className="py-1.5 px-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-semibold hover:text-white transition-all duration-300 cursor-pointer">
                    Connect Twitter
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="max-w-3xl mx-auto space-y-8 animate-fadeIn">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Account Settings</h1>
              <p className="text-slate-400 text-sm">
                Manage your credentials, platform integrations, and billing preferences.
              </p>
            </div>

            {/* Profile Setup Form */}
            <div className="bg-slate-950/40 border border-slate-900/80 rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-4">Profile Information</h3>
              <form onSubmit={saveProfileSettings} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={settingsName}
                      onChange={(e) => setSettingsName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full bg-slate-900/50 border border-slate-800 focus:border-purple-500/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-all duration-300"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={settingsEmail}
                      disabled
                      className="w-full bg-slate-900/20 border border-slate-900/80 rounded-xl px-4 py-2.5 text-sm text-slate-500 cursor-not-allowed focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-2">
                  <button
                    type="submit"
                    disabled={isSavingSettings}
                    className="py-2.5 px-6 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:bg-purple-900 text-sm font-semibold transition-all duration-300 cursor-pointer"
                  >
                    {isSavingSettings ? "Saving..." : "Save Changes"}
                  </button>

                  {saveSuccess && (
                    <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5 animate-fadeIn">
                      <Check size={14} /> Profile updated successfully!
                    </span>
                  )}
                </div>
              </form>
            </div>

            {/* Model Integrations / API Keys */}
            <div className="bg-slate-950/40 border border-slate-900/80 rounded-2xl p-6 space-y-4">
              <div>
                <h3 className="text-lg font-bold">API Integrations</h3>
                <p className="text-xs text-slate-500">
                  Input custom API keys to handle model rendering and caption generation with custom limits.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                      OpenAI API Key
                    </label>
                    <span className="text-[10px] text-purple-400 font-semibold">Active</span>
                  </div>
                  <input
                    type="password"
                    value={apiKeyOpenAI}
                    onChange={(e) => setApiKeyOpenAI(e.target.value)}
                    className="w-full bg-slate-900/50 border border-slate-800 focus:border-purple-500/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-all duration-300"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                      Midjourney / Imagine API Key
                    </label>
                    <span className="text-[10px] text-purple-400 font-semibold">Active</span>
                  </div>
                  <input
                    type="password"
                    value={apiKeyMidjourney}
                    onChange={(e) => setApiKeyMidjourney(e.target.value)}
                    className="w-full bg-slate-900/50 border border-slate-800 focus:border-purple-500/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-all duration-300"
                  />
                </div>
              </div>
            </div>

            {/* Plan Tier Status */}
            <div className="bg-slate-950/40 border border-slate-900/80 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold">Subscription Plan</h3>
                <p className="text-xs text-purple-400 font-bold mt-1">Creator Pro Tier</p>
                <p className="text-xs text-slate-500 mt-1">
                  Next payment of $49.00 scheduled for August 7, 2026.
                </p>
              </div>
              <button className="py-2 px-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-all duration-300 cursor-pointer">
                Manage Billing
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

