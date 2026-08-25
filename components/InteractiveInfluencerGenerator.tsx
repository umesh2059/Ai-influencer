"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Instagram, TikTok, YouTube, Twitter, Check, Users, Globe, Zap } from "./Icons";


interface InfluencerProfile {
  name: string;
  handle: string;
  bio: string;
  followers: string;
  posts: string;
  engagement: string;
  avatarUrl: string;
  recentPostUrl: string;
  postCaption: string;
  tags: string[];
}

const INFLUENCER_DB: Record<string, Record<string, InfluencerProfile>> = {
  Fashion: {
    Photorealistic: {
      name: "Aria Sterling",
      handle: "@aria.sterling.ai",
      bio: "Virtual high-fashion model. Showcasing sustainable design & digital couture. Colabs in DM ✨ Runway of the future.",
      followers: "342,800",
      posts: "148",
      engagement: "6.8%",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&h=400&q=80",
      recentPostUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&h=800&q=80",
      postCaption: "Golden hour in Virtual Milan. Wearing custom digital silk that adapts to the light. 👗🌅 #digitalfashion #sustainability #metaverse",
      tags: ["Digital Fashion", "Sustainability", "Metaverse"]
    },
    Cyberpunk: {
      name: "V3RA",
      handle: "@v3ra.cyber.model",
      bio: "Synth-streetwear enthusiast. Inspired by Neo-Tokyo neon lights & cyberpunk culture. ⚡ 'Reimagining human fabrics.'",
      followers: "189,400",
      posts: "92",
      engagement: "8.4%",
      avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&h=400&q=80",
      recentPostUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&h=800&q=80",
      postCaption: "Chasing neon drops in Shibuya. Cyberpunk grids are ready. 🛸🦾 #cyberpunk #shibuya #futurewear #streetstyle",
      tags: ["Cyberpunk", "Streetwear", "Techwear"]
    },
    "Anime/3D": {
      name: "Yuki Chan",
      handle: "@yuki.chann.3d",
      bio: "Chibi fashionista & vtuber style influencer. Bringing kawaii colors and 3D modeling aesthetics to life! 💖🌈",
      followers: "521,000",
      posts: "310",
      engagement: "11.2%",
      avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&h=400&q=80",
      recentPostUrl: "https://images.unsplash.com/photo-1560942485-b2a11cc13456?auto=format&fit=crop&w=600&h=800&q=80",
      postCaption: "Unboxed my new pastel hoodie and standard combat boots combo! What do you guys think? 💕🌸 #kawaiifashion #3dstyle #vtuber",
      tags: ["Kawaii Fashion", "3D Style", "VTuber"]
    }
  },
  Fitness: {
    Photorealistic: {
      name: "Coach Marcus AI",
      handle: "@marcus.fit.ai",
      bio: "AI fitness coach & mental strength advocate. Real physics, digital discipline. Let's design your ultimate routine. 🏋️‍♂️💪",
      followers: "215,600",
      posts: "184",
      engagement: "5.4%",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&h=400&q=80",
      recentPostUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&h=800&q=80",
      postCaption: "No shortcuts. No exceptions. Just pure daily dedication. Your virtual trainer is ready. ⚡🏃‍♂️ #fitnessgoals #mindset #noexcuses #motivation",
      tags: ["Fitness Goals", "Workout Routine", "Mindset"]
    },
    Cyberpunk: {
      name: "NEO_ATHLETE",
      handle: "@neo.athlete.grid",
      bio: "Holographic biomechanical performance & biohacking influencer. Running sub-4 minute miles in the matrix.",
      followers: "98,100",
      posts: "73",
      engagement: "7.1%",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=400&q=80",
      recentPostUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&h=800&q=80",
      postCaption: "Simulating high-altitude runs at 100% capacity. Calibrating internal systems. 🤖💨 #biohacking #neonathlete #cybersport",
      tags: ["Biohacking", "Cyber Sport", "Grid Performance"]
    },
    "Anime/3D": {
      name: "Zack Storm",
      handle: "@zackstorm_3d",
      bio: "Web3 athletic hero! Training to break records in the virtual arena. Join the Storm Squad today! ⚡🔥",
      followers: "167,000",
      posts: "120",
      engagement: "9.3%",
      avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&h=400&q=80",
      recentPostUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=600&h=800&q=80",
      postCaption: "Finished a massive virtual weights session. The grind never stops! Who's joining the server tonight? 🎮🏋️‍♂️ #3danime #gymgrind #stormgames",
      tags: ["Gym Grind", "Virtual Fitness", "SquadGoals"]
    }
  },
  "Tech & Gaming": {
    Photorealistic: {
      name: "Leo Dev",
      handle: "@leodev.ai",
      bio: "Virtual developer & product reviewer. Building with Next.js, AI systems, and creating clean workspace setups. 💻🤖",
      followers: "284,000",
      posts: "220",
      engagement: "7.9%",
      avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&h=400&q=80",
      recentPostUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&h=800&q=80",
      postCaption: "Rating my new custom mechanical keyboard setup. The clack is incredible. Typing code at 140 WPM. ⌨️💻 #desksetup #developer #webdev",
      tags: ["Developer Setup", "Mechanical Keyboard", "Nextjs"]
    },
    Cyberpunk: {
      name: "K4I_GRID",
      handle: "@kai_into_the_grid",
      bio: "AI firmware architect, cyber deck modifier, and retro hacker. Living deep inside the sub-networks. 🌐💾",
      followers: "305,000",
      posts: "165",
      engagement: "8.7%",
      avatarUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&h=400&q=80",
      recentPostUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&h=800&q=80",
      postCaption: "Booted the multi-screen terminal system today. Overclocking neural links for peak AI compilation. 🧠🌐 #cyberpunk #terminal #linux #hacker",
      tags: ["Cyberpunk Setup", "Neural Link", "Hacking"]
    },
    "Anime/3D": {
      name: "Sakura Pixel",
      handle: "@sakurapixel.gg",
      bio: "3D virtual streamer & vtuber. Playing JRPGs, designing pixels, and spreading cozy vibes. Stream starting now! 🎮🌸",
      followers: "640,000",
      posts: "450",
      engagement: "12.4%",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&h=400&q=80",
      recentPostUrl: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=600&h=800&q=80",
      postCaption: "Chilling in my cozy pink command station. Today we are speedrunning retro classics! 🎮🎀 #cozygaming #vtuberstream #retrogaming",
      tags: ["Cozy Gaming", "Streamer Setup", "Vtubing"]
    }
  },
  Travel: {
    Photorealistic: {
      name: "Elena Wanders",
      handle: "@elena.wanders.ai",
      bio: "Virtual explorer. Searching for hidden paradises, stunning architecture, and local flavors. AI generation with human soul. ✈️🌍",
      followers: "410,000",
      posts: "205",
      engagement: "6.2%",
      avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&h=400&q=80",
      recentPostUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&h=800&q=80",
      postCaption: "Waking up to this sunrise in Santorini. Perfectly simulated light reflection on white domes. 🌊🏨 #traveldiary #santorini #greece #aiwanders",
      tags: ["Santorini Sunrise", "Greece Travel", "Dream Escape"]
    },
    Cyberpunk: {
      name: "LUNA_0",
      handle: "@luna_offgrid",
      bio: "Documenting desolate futuristic landscapes, abandoned launch pads, and high-altitude neon outposts. 🛸🏜️",
      followers: "154,000",
      posts: "81",
      engagement: "7.5%",
      avatarUrl: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=400&h=400&q=80",
      recentPostUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&h=800&q=80",
      postCaption: "Surveying the high-altitude communication tower. Sunset over the synthetic salt flats. 📡🌇 #cybertravel #scifiworld #futurism",
      tags: ["Scifi Travel", "Cyber Landscapes", "Offgrid Network"]
    },
    "Anime/3D": {
      name: "Milo Sky",
      handle: "@milo.sky.world",
      bio: "Virtual backpacker exploring colorful celestial landscapes and fantasy-styled historic towns. Wanderlust is eternal! 🎒🪐",
      followers: "282,000",
      posts: "115",
      engagement: "10.5%",
      avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&h=400&q=80",
      recentPostUrl: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&h=800&q=80",
      postCaption: "Discovered this magical floating island. The trees glow in shades of magenta and lavender! 🏝️💜 #fantasyworld #cartoonworld #skyisland",
      tags: ["Magical Escapes", "Anime Sky", "Fantasy Travel"]
    }
  }
};

const GENERATING_STEPS = [
  "Initializing Diffusion Model...",
  "Synthesizing face topology...",
  "Applying lighting parameters...",
  "Rendering consistent poses...",
  "Formulating engaging social persona...",
  "Finalizing AI Influencer Model! 🎉"
];

export default function InteractiveInfluencerGenerator() {
  const [niche, setNiche] = useState<"Fashion" | "Fitness" | "Tech & Gaming" | "Travel">("Fashion");
  const [style, setStyle] = useState<"Photorealistic" | "Cyberpunk" | "Anime/3D">("Photorealistic");
  const [platform, setPlatform] = useState<"Instagram" | "TikTok" | "YouTube">("Instagram");

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [profile, setProfile] = useState<InfluencerProfile>(INFLUENCER_DB.Fashion.Photorealistic);

  const handleGenerate = () => {
    setIsGenerating(true);
    setGenerationStep(0);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsGenerating(false);
            setProfile(INFLUENCER_DB[niche][style]);
          }, 300);
          return 100;
        }
        const nextProgress = prev + 5;
        // Map progress to steps
        const stepIndex = Math.min(
          Math.floor((nextProgress / 100) * GENERATING_STEPS.length),
          GENERATING_STEPS.length - 1
        );
        setGenerationStep(stepIndex);
        return nextProgress;
      });
    }, 100);
  };

  return (
    <section id="demo" className="py-24 relative overflow-hidden bg-black/40">
      {/* Background decoration elements */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-purple-600/10 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-pink-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel border-purple-500/20 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles size={14} className="animate-pulse" />
            Live Experience Arena
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">
            Test Drive the <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-500 to-pink-500">AI Generator</span>
          </h2>
          <p className="text-lg text-slate-400">
            Configure your target niche, aesthetic, and platform. See how quickly our engine creates a unique influencer persona and consistent viral content ready to post.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          {/* Controls Panel */}
          <div className="lg:col-span-5 flex flex-col justify-between glass-panel rounded-3xl p-8 border-slate-800">
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 text-sm">1</span>
                  Select Creator Niche
                </h3>
                <p className="text-xs text-slate-400 mb-4">Choose the content theme for your AI model.</p>
                <div className="grid grid-cols-2 gap-3">
                  {(["Fashion", "Fitness", "Tech & Gaming", "Travel"] as const).map((n) => (
                    <button
                      key={n}
                      onClick={() => {
                        if (!isGenerating) {
                          setNiche(n);
                          setProfile(INFLUENCER_DB[n][style]);
                        }
                      }}
                      disabled={isGenerating}
                      className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all duration-200 cursor-pointer ${
                        niche === n
                          ? "bg-purple-600/20 border-purple-500 text-purple-200 shadow-[0_0_15px_rgba(147,51,234,0.15)]"
                          : "bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-lg bg-pink-500/20 flex items-center justify-center text-pink-400 text-sm">2</span>
                  Aesthetic Style
                </h3>
                <p className="text-xs text-slate-400 mb-4">Choose render model styling & texture consistency.</p>
                <div className="grid grid-cols-3 gap-2">
                  {(["Photorealistic", "Cyberpunk", "Anime/3D"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        if (!isGenerating) {
                          setStyle(s);
                          setProfile(INFLUENCER_DB[niche][s]);
                        }
                      }}
                      disabled={isGenerating}
                      className={`py-2.5 px-2 rounded-xl border text-xs font-medium transition-all duration-200 cursor-pointer ${
                        style === s
                          ? "bg-pink-600/20 border-pink-500 text-pink-200 shadow-[0_0_15px_rgba(236,72,153,0.15)]"
                          : "bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 text-sm">3</span>
                  Target Network
                </h3>
                <p className="text-xs text-slate-400 mb-4">Optimizes resolution and media size constraints.</p>
                <div className="flex gap-3">
                  {([
                    { id: "Instagram", icon: Instagram, label: "Instagram", color: "hover:text-pink-400" },
                    { id: "TikTok", icon: TikTok, label: "TikTok", color: "hover:text-teal-400" },
                    { id: "YouTube", icon: YouTube, label: "YouTube Shorts", color: "hover:text-red-400" }
                  ] as const).map((p) => {
                    const Icon = p.icon;
                    return (
                      <button
                        key={p.id}
                        onClick={() => !isGenerating && setPlatform(p.id)}
                        disabled={isGenerating}
                        className={`flex-1 py-3 px-3 rounded-xl border text-xs font-medium flex flex-col items-center gap-2 transition-all duration-200 cursor-pointer ${
                          platform === p.id
                            ? "bg-blue-600/20 border-blue-500 text-blue-200 shadow-[0_0_15px_rgba(59,130,246,0.15)]"
                            : `bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700 ${p.color}`
                        }`}
                      >
                        <Icon size={20} />
                        <span>{p.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-800/80">
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full relative py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 hover:from-purple-500 hover:via-fuchsia-500 hover:to-pink-500 text-white font-semibold transition-all duration-300 shadow-[0_4px_25px_rgba(168,85,247,0.3)] hover:shadow-[0_4px_30px_rgba(168,85,247,0.5)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group overflow-hidden"
              >
                <div className="absolute inset-0 w-1/2 h-full bg-white/10 skew-x-[-25deg] -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-out" />
                <Sparkles size={18} className={isGenerating ? "animate-spin" : "animate-bounce"} />
                {isGenerating ? "Synthesizing AI Influencer..." : "Re-Generate Custom Model"}
              </button>
            </div>
          </div>

          {/* Generator Render Output Preview */}
          <div className="lg:col-span-7 glass-panel rounded-3xl border-slate-800 flex flex-col overflow-hidden relative min-h-[500px]">
            {isGenerating ? (
              /* Loading screen Overlay */
              <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md z-20 flex flex-col items-center justify-center p-8">
                <div className="relative w-24 h-24 mb-6">
                  {/* Spinning rings */}
                  <div className="absolute inset-0 rounded-full border-4 border-purple-500/10 border-t-purple-500 animate-spin" />
                  <div className="absolute inset-2 rounded-full border-4 border-pink-500/10 border-b-pink-500 animate-spin-slow" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="text-purple-400 animate-pulse" size={28} />
                  </div>
                </div>
                <div className="text-center space-y-3 max-w-sm">
                  <h4 className="text-lg font-bold text-white">Generating Virtual Persona</h4>
                  <div className="w-64 h-2.5 bg-slate-800 rounded-full overflow-hidden mx-auto">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 transition-all duration-100 rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-sm text-purple-400 font-mono h-6 animate-pulse">
                    {GENERATING_STEPS[generationStep]}
                  </p>
                  <p className="text-xs text-slate-500">{progress}% completed</p>
                </div>
              </div>
            ) : null}

            {/* Dashboard / Profile Preview Header */}
            <div className="border-b border-slate-800/80 px-6 py-4 bg-slate-950/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <div className="w-3 h-3 rounded-full bg-green-500/70" />
              </div>
              <span className="text-xs font-mono text-slate-500">model_engine_v4.2.active</span>
              <div className="px-2.5 py-0.5 rounded bg-green-500/10 border border-green-500/20 text-[10px] font-mono text-green-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-ping" />
                SYNCED
              </div>
            </div>

            {/* Influencer Profile Card Grid */}
            <div className="p-6 md:p-8 flex-1 grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Profile Details Column */}
              <div className="md:col-span-5 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  {/* Avatar section */}
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-[4px]" />
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={profile.avatarUrl}
                        alt={profile.name}
                        className="w-16 h-16 rounded-full object-cover relative border-2 border-slate-950"
                      />
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center border-2 border-slate-950 text-white text-[10px]">
                        <Sparkles size={10} />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-lg flex items-center gap-1.5">
                        {profile.name}
                        <span className="inline-block w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center text-[8px] font-bold">
                          ✓
                        </span>
                      </h4>
                      <p className="text-xs text-purple-400 font-mono">{profile.handle}</p>
                    </div>
                  </div>

                  {/* Bio details */}
                  <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
                    <p className="mb-2 font-semibold text-purple-300">AI GENERATED BIO:</p>
                    <p>{profile.bio}</p>
                  </div>
                </div>

                {/* Statistics panel */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-3 rounded-xl bg-slate-900/30 border border-slate-800 text-center">
                    <p className="text-[10px] text-slate-500 uppercase font-semibold">Followers</p>
                    <p className="text-sm font-bold text-white mt-0.5">{profile.followers}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/30 border border-slate-800 text-center">
                    <p className="text-[10px] text-slate-500 uppercase font-semibold">Posts</p>
                    <p className="text-sm font-bold text-white mt-0.5">{profile.posts}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/30 border border-slate-800 text-center">
                    <p className="text-[10px] text-slate-500 uppercase font-semibold">Engagement</p>
                    <p className="text-sm font-bold text-purple-400 mt-0.5">{profile.engagement}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Aesthetic Tags</p>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.tags.map((tag) => (
                      <span key={tag} className="px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-[10px] text-slate-400 font-medium">
                        #{tag.toLowerCase()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Feed/Creative Output Visual */}
              <div className="md:col-span-7 flex flex-col space-y-4">
                <p className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                  <Zap size={12} className="text-yellow-400" />
                  Latest Consistent AI Render Post ({platform})
                </p>
                <div className="relative rounded-2xl overflow-hidden aspect-[4/5] bg-slate-900 border border-slate-800 group shadow-inner">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={profile.recentPostUrl}
                    alt="AI Post Visual"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
                  
                  {/* Floating badge inside picture */}
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[10px] text-white flex items-center gap-1">
                    <Sparkles size={10} className="text-purple-400" />
                    <span>Consistent Render</span>
                  </div>

                  {/* Post details */}
                  <div className="absolute bottom-0 inset-x-0 p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={profile.avatarUrl} alt="" className="w-7 h-7 rounded-full object-cover border border-white/20" />
                      <span className="text-xs font-bold text-white">{profile.handle}</span>
                    </div>
                    <p className="text-[11px] text-slate-200 line-clamp-2 leading-relaxed">
                      {profile.postCaption}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
