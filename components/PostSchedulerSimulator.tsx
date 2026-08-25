"use client";

import React, { useState } from "react";
import { Calendar, Instagram, TikTok, YouTube, Twitter, Check, Sparkles, Zap } from "./Icons";

interface ScheduledPost {
  id: string;
  time: string;
  platform: "Instagram" | "TikTok" | "YouTube" | "Twitter";
  content: string;
  status: "Published" | "Scheduled" | "Publishing";
  engagement: string;
  avatarUrl: string;
  thumbnailUrl: string;
}

const SCHEDULE_DATA: Record<string, ScheduledPost[]> = {
  Mon: [
    {
      id: "m1",
      time: "08:30 AM",
      platform: "Instagram",
      content: "Morning routine in the digital loft. Calibrating lighting systems.",
      status: "Published",
      engagement: "9.2%",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80",
      thumbnailUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80"
    },
    {
      id: "m2",
      time: "02:15 PM",
      platform: "TikTok",
      content: "Cyber streetwear outfit grid reveal. High-voltage styles! ⚡",
      status: "Scheduled",
      engagement: "14.8%",
      avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&h=80&q=80",
      thumbnailUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=300&q=80"
    },
    {
      id: "m3",
      time: "07:00 PM",
      platform: "Twitter",
      content: "Why digital models are achieving 3x higher ad CTR compared to traditional photography campaigns in 2026. A thread...",
      status: "Scheduled",
      engagement: "7.1%",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80",
      thumbnailUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80"
    }
  ],
  Tue: [
    {
      id: "t1",
      time: "09:00 AM",
      platform: "YouTube",
      content: "Unboxing virtual tech items! The future of gaming spaces is 3D.",
      status: "Published",
      engagement: "11.5%",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80",
      thumbnailUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=300&q=80"
    },
    {
      id: "t2",
      time: "04:30 PM",
      platform: "Instagram",
      content: "Cozy coding vibes. Building React apps in our pixel headquarters.",
      status: "Published",
      engagement: "8.4%",
      avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=80&h=80&q=80",
      thumbnailUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=300&q=80"
    },
    {
      id: "t3",
      time: "08:15 PM",
      platform: "TikTok",
      content: "Speedrun of cozy games catalog. Live audio synthesizers active! 🎹",
      status: "Scheduled",
      engagement: "16.1%",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&h=80&q=80",
      thumbnailUrl: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=300&q=80"
    }
  ],
  Wed: [
    {
      id: "w1",
      time: "10:15 AM",
      platform: "Instagram",
      content: "Sunrise in virtual Santorini. Synthesized reflections on sea domes.",
      status: "Published",
      engagement: "9.8%",
      avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&h=80&q=80",
      thumbnailUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=300&q=80"
    },
    {
      id: "w2",
      time: "03:00 PM",
      platform: "Twitter",
      content: "Analyzing engagement models for digital models. Higher density, stable trends. Here are the core charts.",
      status: "Published",
      engagement: "6.9%",
      avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&h=80&q=80",
      thumbnailUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=300&q=80"
    },
    {
      id: "w3",
      time: "09:30 PM",
      platform: "YouTube",
      content: "Cinematic flythrough of the Neon Cyber Outpost. 🛰️",
      status: "Scheduled",
      engagement: "13.2%",
      avatarUrl: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=80&h=80&q=80",
      thumbnailUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=300&q=80"
    }
  ],
  Thu: [
    {
      id: "h1",
      time: "09:00 AM",
      platform: "Instagram",
      content: "Gym training at 100% simulated capacity. Consistency is a mathematical law.",
      status: "Published",
      engagement: "8.2%",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&h=80&q=80",
      thumbnailUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=300&q=80"
    },
    {
      id: "h2",
      time: "01:30 PM",
      platform: "TikTok",
      content: "Holographic biohacking tricks. Calibrating performance metrics.",
      status: "Published",
      engagement: "11.9%",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80",
      thumbnailUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=300&q=80"
    },
    {
      id: "h3",
      time: "06:00 PM",
      platform: "Instagram",
      content: "Virtual sunset run with my biomechanical companion! 🦾🤖",
      status: "Scheduled",
      engagement: "10.4%",
      avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=80&h=80&q=80",
      thumbnailUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=300&q=80"
    }
  ],
  Fri: [
    {
      id: "f1",
      time: "11:00 AM",
      platform: "TikTok",
      content: "Cozy pixel travel diary. Packing bags for sky islands. 🎒🌈",
      status: "Published",
      engagement: "15.2%",
      avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=80&h=80&q=80",
      thumbnailUrl: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=300&q=80"
    },
    {
      id: "f2",
      time: "05:00 PM",
      platform: "Instagram",
      content: "Virtual street style catalog drop. Reimagining Tokyo winter gears.",
      status: "Scheduled",
      engagement: "9.9%",
      avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&h=80&q=80",
      thumbnailUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=300&q=80"
    },
    {
      id: "f3",
      time: "09:45 PM",
      platform: "Twitter",
      content: "Why synthetic influencers are achieving infinite scale over physical creators. Thread on content pipelines.",
      status: "Scheduled",
      engagement: "7.8%",
      avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=80&h=80&q=80",
      thumbnailUrl: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&w=300&q=80"
    }
  ]
};

export default function PostSchedulerSimulator() {
  const [activeDay, setActiveDay] = useState<"Mon" | "Tue" | "Wed" | "Thu" | "Fri">("Mon");
  const [posts, setPosts] = useState<Record<string, ScheduledPost[]>>(SCHEDULE_DATA);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([
    "[11:45:02] Scheduler daemon initialized.",
    "[11:45:03] Syncing metadata with Instagram API & TikTok Graph.",
    "[11:45:05] All queues loaded. Ready for automatic post triggers."
  ]);
  const [isTriggering, setIsTriggering] = useState(false);

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "Instagram": return <Instagram size={14} className="text-pink-400" />;
      case "TikTok": return <TikTok size={14} className="text-teal-400" />;
      case "YouTube": return <YouTube size={14} className="text-red-400" />;
      case "Twitter": return <Twitter size={14} className="text-blue-400" />;
      default: return null;
    }
  };

  const handleTriggerAutoPost = () => {
    const currentDayPosts = posts[activeDay];
    const nextScheduledPost = currentDayPosts.find((p) => p.status === "Scheduled");

    if (!nextScheduledPost) {
      // All posts already published
      setConsoleLogs((prev) => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] No scheduled posts remaining for ${activeDay}. Try switching days!`
      ]);
      return;
    }

    setIsTriggering(true);
    
    // Log publishing action
    setConsoleLogs((prev) => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] Triggering dispatch for Post ID: ${nextScheduledPost.id}...`,
      `[${new Date().toLocaleTimeString()}] Connecting to ${nextScheduledPost.platform} endpoint...`
    ]);

    // Change status to Publishing
    setPosts((prev) => {
      const updatedDayPosts = prev[activeDay].map((p) =>
        p.id === nextScheduledPost.id ? { ...p, status: "Publishing" as const } : p
      );
      return { ...prev, [activeDay]: updatedDayPosts };
    });

    // Simulate server side publishing delays
    setTimeout(() => {
      setPosts((prev) => {
        const updatedDayPosts = prev[activeDay].map((p) =>
          p.id === nextScheduledPost.id ? { ...p, status: "Published" as const } : p
        );
        return { ...prev, [activeDay]: updatedDayPosts };
      });

      setConsoleLogs((prev) => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] SUCCESS: Post published to ${nextScheduledPost.platform}.`,
        `[${new Date().toLocaleTimeString()}] Virality score achieved: ${nextScheduledPost.engagement} Engagement rate!`
      ]);
      setIsTriggering(false);
    }, 1500);
  };

  return (
    <section id="scheduler" className="py-24 relative bg-black/20">
      <div className="absolute top-1/4 right-1/3 w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-[80px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Text/Intro Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider">
              <Calendar size={14} />
              Autonomous Publisher
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
              Hands-Off Scheduling. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Maximum Virality.</span>
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed">
              Once generated, your AI Influencer doesn&apos;t sleep. Our smart scheduler automatically posts content, selects tags, drafts copy, and schedules posts for times when engagement peaks.
            </p>

            <div className="space-y-4 pt-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 w-5 h-5 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400">
                  <Check size={12} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Dynamic Audience Syncing</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Identifies hot-spots where target demographics are active.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 w-5 h-5 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400">
                  <Check size={12} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Custom Copywriting Engine</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Writes captions matching your influencer&apos;s unique voice style.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 w-5 h-5 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400">
                  <Check size={12} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Predictive Analytics Score</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Rates potential performance before hitting the publish queue.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Scheduler Card */}
          <div className="lg:col-span-7 flex flex-col glass-panel rounded-3xl border-slate-800 overflow-hidden shadow-2xl">
            {/* Scheduler Header */}
            <div className="p-6 border-b border-slate-800/80 bg-slate-950/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-white text-lg flex items-center gap-2">
                  <Calendar size={18} className="text-blue-400" />
                  Social Scheduler Queue
                </h3>
                <p className="text-xs text-slate-500">Autonomous calendar dispatcher panel</p>
              </div>

              {/* Day selection */}
              <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl">
                {(["Mon", "Tue", "Wed", "Thu", "Fri"] as const).map((day) => (
                  <button
                    key={day}
                    onClick={() => setActiveDay(day)}
                    className={`py-1.5 px-3.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                      activeDay === day
                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/15"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            {/* Scheduler Queue Listing */}
            <div className="p-6 space-y-4">
              {posts[activeDay].map((post) => (
                <div
                  key={post.id}
                  className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-slate-700/80 transition-all duration-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5">
                    {/* Media thumbnail */}
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={post.thumbnailUrl}
                        alt="Media Thumbnail"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-1 right-1 p-0.5 rounded bg-black/80">
                        {getPlatformIcon(post.platform)}
                      </div>
                    </div>

                    {/* Post contents */}
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-slate-500 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">
                          {post.time}
                        </span>
                        <span className="text-xs text-slate-400 font-semibold">{post.platform}</span>
                      </div>
                      <p className="text-xs text-slate-200 line-clamp-1 max-w-[280px] md:max-w-[340px]">
                        {post.content}
                      </p>
                    </div>
                  </div>

                  {/* Actions & Status panel */}
                  <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-4 pl-[72px] md:pl-0 border-t border-slate-900 md:border-none pt-3 md:pt-0">
                    <div className="text-left md:text-right">
                      <p className="text-[9px] uppercase font-bold text-slate-500">Pred. Engagement</p>
                      <p className="text-xs font-bold text-blue-400 flex items-center md:justify-end gap-1 mt-0.5">
                        <Zap size={10} className="text-yellow-500 fill-yellow-500 animate-pulse" />
                        {post.engagement}
                      </p>
                    </div>

                    <div>
                      {post.status === "Published" ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-[10px] font-semibold text-green-400">
                          <Check size={10} /> Published
                        </span>
                      ) : post.status === "Publishing" ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-[10px] font-semibold text-yellow-400 animate-pulse">
                          <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-ping" /> Dispatching...
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-[10px] font-semibold text-slate-300">
                          ⏱ Scheduled
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Simulator action and Console Logger */}
            <div className="p-6 border-t border-slate-800/80 bg-slate-950/40 flex flex-col md:flex-row items-stretch gap-6">
              {/* Console Logs */}
              <div className="flex-1 p-4 rounded-xl bg-black border border-slate-900 font-mono text-[10px] text-slate-400 space-y-1 h-[90px] overflow-y-auto">
                <p className="text-blue-500 font-semibold mb-1">=== AUTO SCHEDULER SYSTEM LOG ===</p>
                {consoleLogs.slice(-4).map((log, index) => (
                  <p key={index} className="truncate">
                    {log}
                  </p>
                ))}
              </div>

              {/* Action Button */}
              <div className="flex flex-col justify-center flex-shrink-0 md:w-[220px]">
                <button
                  onClick={handleTriggerAutoPost}
                  disabled={isTriggering}
                  className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm transition-all duration-300 shadow-[0_4px_20px_rgba(59,130,246,0.25)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group overflow-hidden relative"
                >
                  <Sparkles size={14} className={isTriggering ? "animate-spin" : ""} />
                  {isTriggering ? "Publishing..." : "Trigger Auto-Post Run"}
                </button>
                <p className="text-[10px] text-slate-500 text-center mt-2">
                  Publishes next scheduled post in the list.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
