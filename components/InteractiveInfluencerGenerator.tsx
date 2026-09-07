"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Instagram, TikTok, YouTube } from "./Icons";

interface InfluencerProfile {
  name: string;
  handle: string;
  bio: string;
  followers: string;
  posts: string;
  engagement: string;
  avatarUrl: string;
  imageUrl: string;
  videoUrl?: string;
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
      imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=85",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-neon-light-40484-large.mp4",
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
      imageUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=85",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-futuristic-woman-with-neon-lights-41584-large.mp4",
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
      imageUrl: "https://images.unsplash.com/photo-1560942485-b2a11cc13456?auto=format&fit=crop&w=800&q=85",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-young-woman-with-colored-hair-dancing-in-studio-41775-large.mp4",
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
      imageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=85",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-man-training-arms-with-dumbbells-41551-large.mp4",
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
      imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=85",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-athlete-getting-ready-to-run-on-a-running-track-40342-large.mp4",
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
      imageUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=800&q=85",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-young-man-exercising-in-a-park-with-sports-wear-40915-large.mp4",
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
      imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=85",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-hands-typing-on-a-laptop-keyboard-41132-large.mp4",
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
      imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=85",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-young-man-wearing-cyberpunk-glasses-in-neon-light-41586-large.mp4",
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
      imageUrl: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=85",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-girl-gamer-playing-video-games-41981-large.mp4",
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
      imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=85",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-waves-coming-to-the-beach-5016-large.mp4",
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
      imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=85",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-flying-over-a-futuristic-city-43285-large.mp4",
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
      imageUrl: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=85",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-clouds-and-blue-sky-2408-large.mp4",
      postCaption: "Discovered this magical floating island. The trees glow in shades of magenta and lavender! 🏝️💜 #fantasyworld #cartoonworld #skyisland",
      tags: ["Magical Escapes", "Anime Sky", "Fantasy Travel"]
    }
  }
};

const GEMINI_GENERATING_STEPS = [
  "Connecting to Google Gemini API...",
  "Gemini: Parsing prompt & formulating neural prompt embeddings...",
  "Gemini: Synthesizing facial topology & photorealistic textures...",
  "Gemini: Applying volumetric lighting and skin shading...",
  "Downloading high-fidelity output from Gemini... 🎉"
];

export default function InteractiveInfluencerGenerator() {
  const [niche, setNiche] = useState<"Fashion" | "Fitness" | "Tech & Gaming" | "Travel">("Fashion");
  const [style, setStyle] = useState<"Photorealistic" | "Cyberpunk" | "Anime/3D">("Photorealistic");
  const [platform, setPlatform] = useState<"Instagram" | "TikTok" | "YouTube">("Instagram");
  const [aspectRatio, setAspectRatio] = useState<"1:1" | "9:16" | "16:9">("9:16");

  // Custom Selection Prompt
  const [userPrompt, setUserPrompt] = useState<string>("");
  const [apiKey, setApiKey] = useState<string>("");
  const [showKeyInput, setShowKeyInput] = useState<boolean>(false);

  // Generation status
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");
  const [profile, setProfile] = useState<InfluencerProfile>(INFLUENCER_DB.Fashion.Photorealistic);
  const [isLiveGeminiOutput, setIsLiveGeminiOutput] = useState(false);
  const [notification, setNotification] = useState<{ text: string; type: "success" | "info" | "error" } | null>(null);

  // Initialize and update default prompt when selections change
  useEffect(() => {
    const basePersona = INFLUENCER_DB[niche]?.[style]?.name || "AI Influencer";
    const promptText = `Ultra-detailed ${style.toLowerCase()} portrait and dynamic pose of virtual influencer ${basePersona} for ${platform}, ${niche.toLowerCase()} niche. Volumetric lighting, sharp facial topology, hyper-realistic textures, natural skin pores, 8k resolution cinematic look.`;
    setUserPrompt(promptText);
  }, [niche, style, platform]);

  // Load API key from localStorage if available
  useEffect(() => {
    const savedKey = localStorage.getItem("gemini_api_key");
    if (savedKey) setApiKey(savedKey);
  }, []);

  const handleSaveKey = (val: string) => {
    setApiKey(val);
    if (val.trim()) {
      localStorage.setItem("gemini_api_key", val.trim());
      setNotification({ text: "Gemini API Key saved in local session!", type: "success" });
    } else {
      localStorage.removeItem("gemini_api_key");
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGenerationStep(0);
    setProgress(5);
    setStatusMessage("Submitting request to Google Gemini API...");
    setNotification(null);

    // Dynamic progress bar ticker
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        const next = prev + 3;
        const stepIdx = Math.min(
          Math.floor((next / 100) * GEMINI_GENERATING_STEPS.length),
          GEMINI_GENERATING_STEPS.length - 1
        );
        setGenerationStep(stepIdx);
        setStatusMessage(GEMINI_GENERATING_STEPS[stepIdx]);
        return next;
      });
    }, 350);

    try {
      const response = await fetch("/api/gemini/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: userPrompt,
          aspect_ratio: aspectRatio,
          apiKey: apiKey.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate with Gemini API");
      }

      let generatedImageUrl = profile.imageUrl;
      let usedLiveApi = false;

      // Handle Simulated/Fallback mode
      if (data.isSimulated) {
        setNotification({
          text: "Demo Preview: Set your GEMINI_API_KEY to trigger live generations.",
          type: "info",
        });
        const currentPreset = INFLUENCER_DB[niche][style];
        generatedImageUrl = currentPreset.imageUrl;
      } else {
        usedLiveApi = true;
        if (data.imageGeneration?.output?.[0]?.url) {
          generatedImageUrl = data.imageGeneration.output[0].url;
        }
        setNotification({
          text: "Successfully generated influencer model with Gemini!",
          type: "success",
        });
      }

      setProgress(100);
      clearInterval(progressInterval);

      setTimeout(() => {
        setIsGenerating(false);
        setIsLiveGeminiOutput(usedLiveApi);
        const preset = INFLUENCER_DB[niche][style];
        setProfile({
          ...preset,
          imageUrl: generatedImageUrl,
          postCaption: `Synthesized with Gemini. ${preset.postCaption}`,
        });
      }, 500);
    } catch (err: any) {
      clearInterval(progressInterval);
      setIsGenerating(false);
      console.error(err);
      setNotification({
        text: `Error: ${err.message || "Failed to connect to Gemini API."} Using high-resolution preview.`,
        type: "error",
      });
      setProfile(INFLUENCER_DB[niche][style]);
    }
  };

  return (
    <section id="demo" className="py-24 relative overflow-hidden bg-black/40">
      {/* Background decoration elements */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 w-[380px] h-[380px] bg-purple-600/10 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[480px] h-[480px] bg-pink-600/10 rounded-full blur-[110px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel border-purple-500/20 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-4 shadow-lg shadow-purple-900/20">
            <Sparkles size={14} className="animate-pulse" />
            Gemini AI Influencer Engine
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-5">
            Synthesize Influencers with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-500">
              Google Gemini
            </span>
          </h2>
          <p className="text-base md:text-lg text-slate-400 leading-relaxed">
            Select creator attributes, tune visual parameters, and formulate tailored prompts.
            Our Gemini-powered architecture delivers photorealistic influencer images.
          </p>
        </div>

        {/* Notification Banner */}
        {notification && (
          <div
            className={`max-w-4xl mx-auto mb-8 p-4 rounded-2xl border text-sm flex items-center justify-between transition-all animate-fadeIn ${
              notification.type === "success"
                ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-300"
                : notification.type === "error"
                ? "bg-rose-950/40 border-rose-500/30 text-rose-300"
                : "bg-purple-950/40 border-purple-500/30 text-purple-300"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Sparkles size={16} />
              <span>{notification.text}</span>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="text-xs opacity-70 hover:opacity-100 cursor-pointer px-2 py-1"
            >
              ✕
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          {/* Controls & Prompt Selection Panel */}
          <div className="lg:col-span-5 flex flex-col justify-between glass-panel rounded-3xl p-6 md:p-8 border-slate-800 space-y-6">
            <div className="space-y-6">
              {/* Step 1: Niche */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-purple-500/20 flex items-center justify-center text-purple-400 text-xs">1</span>
                    Creator Niche
                  </h3>
                  <span className="text-[11px] text-slate-500 font-mono">Domain</span>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
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
                      className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all duration-200 cursor-pointer text-left flex items-center justify-between ${
                        niche === n
                          ? "bg-purple-600/20 border-purple-500 text-purple-200 shadow-[0_0_15px_rgba(147,51,234,0.15)]"
                          : "bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                      }`}
                    >
                      <span>{n}</span>
                      {niche === n && <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Aesthetic Style */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-pink-500/20 flex items-center justify-center text-pink-400 text-xs">2</span>
                    Aesthetic Style
                  </h3>
                  <span className="text-[11px] text-slate-500 font-mono">Texture Rig</span>
                </div>
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
                      className={`py-2.5 px-2 rounded-xl border text-xs font-semibold transition-all duration-200 cursor-pointer text-center ${
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

              {/* Step 3: Target Network & Aspect Ratio */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-xs font-bold text-white mb-2 flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded bg-blue-500/20 flex items-center justify-center text-blue-400 text-[10px]">3</span>
                    Social Network
                  </h3>
                  <div className="flex gap-1.5">
                    {([
                      { id: "Instagram", icon: Instagram },
                      { id: "TikTok", icon: TikTok },
                      { id: "YouTube", icon: YouTube }
                    ] as const).map((p) => {
                      const Icon = p.icon;
                      return (
                        <button
                          key={p.id}
                          onClick={() => !isGenerating && setPlatform(p.id)}
                          disabled={isGenerating}
                          className={`flex-1 py-2 rounded-xl border text-xs flex items-center justify-center transition-all cursor-pointer ${
                            platform === p.id
                              ? "bg-blue-600/20 border-blue-500 text-blue-200 shadow-sm"
                              : "bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700"
                          }`}
                          title={p.id}
                        >
                          <Icon size={16} />
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-white mb-2 flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-[10px]">4</span>
                    Aspect Ratio
                  </h3>
                  <div className="flex gap-1.5">
                    {(["9:16", "1:1", "16:9"] as const).map((ar) => (
                      <button
                        key={ar}
                        onClick={() => !isGenerating && setAspectRatio(ar)}
                        disabled={isGenerating}
                        className={`flex-1 py-2 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer ${
                          aspectRatio === ar
                            ? "bg-indigo-600/20 border-indigo-500 text-indigo-200 shadow-sm"
                            : "bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700"
                        }`}
                      >
                        {ar}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Step 4: User Selection Prompt Area */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded bg-fuchsia-500/20 flex items-center justify-center text-fuchsia-400 text-[10px]">5</span>
                    User Selection Prompt
                  </label>
                  <span className="text-[10px] text-fuchsia-400 font-mono">Gemini Input</span>
                </div>
                <textarea
                  rows={3}
                  value={userPrompt}
                  onChange={(e) => setUserPrompt(e.target.value)}
                  disabled={isGenerating}
                  placeholder="Describe your influencer's appearance, posture, background, lighting..."
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl p-3 text-xs text-slate-200 focus:outline-none focus:border-purple-500/60 transition-colors font-mono leading-relaxed resize-none"
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {["Cinematic 8K", "Volumetric Studio Lighting", "Cyberpunk Neon", "Golden Hour Sunlight", "Minimalist Couture"].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        if (!userPrompt.includes(tag)) {
                          setUserPrompt((prev) => `${prev.trim()}, ${tag}`);
                        }
                      }}
                      className="px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-[10px] text-slate-400 hover:text-white hover:border-slate-700 transition-colors cursor-pointer"
                    >
                      + {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Optional Gemini API Key Direct Input */}
              <div className="pt-2 border-t border-slate-900/60">
                <div className="flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => setShowKeyInput(!showKeyInput)}
                    className="text-[11px] text-purple-400 hover:text-purple-300 font-medium cursor-pointer flex items-center gap-1"
                  >
                    <span>{showKeyInput ? "Hide API Key" : "⚙️ Use custom GEMINI_API_KEY"}</span>
                  </button>
                  <span className="text-[10px] text-slate-500">
                    {apiKey.trim() ? "Custom Key Active" : "Default / Fallback Active"}
                  </span>
                </div>
                {showKeyInput && (
                  <div className="mt-2 space-y-1.5 animate-fadeIn">
                    <input
                      type="password"
                      placeholder="AIza..."
                      value={apiKey}
                      onChange={(e) => handleSaveKey(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 font-mono"
                    />
                    <p className="text-[10px] text-slate-500">
                      Saved safely in your browser session. Leave empty to use system environment key or simulation.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Action Trigger Button */}
            <div className="pt-4 border-t border-slate-800/80">
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full relative py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 hover:from-purple-500 hover:via-fuchsia-500 hover:to-pink-500 active:scale-[0.99] text-white font-bold transition-all duration-300 shadow-[0_4px_25px_rgba(168,85,247,0.35)] hover:shadow-[0_4px_35px_rgba(168,85,247,0.6)] flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group overflow-hidden"
              >
                <div className="absolute inset-0 w-1/2 h-full bg-white/15 skew-x-[-25deg] -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-out" />
                <Sparkles size={20} className={isGenerating ? "animate-spin text-white" : "animate-bounce text-yellow-300"} />
                <div className="text-left">
                  <div className="text-sm font-extrabold leading-none">
                    {isGenerating ? "Synthesizing with Gemini..." : "Generate Influencer"}
                  </div>
                  <div className="text-[10px] font-mono text-purple-200 font-normal mt-0.5">
                    {isGenerating ? "Processing Generation Job" : "Powered by Google Gemini"}
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Generator Render Output Preview Panel */}
          <div className="lg:col-span-7 glass-panel rounded-3xl border-slate-800 flex flex-col overflow-hidden relative min-h-[600px]">
            {/* Generating Overlay Modal */}
            {isGenerating && (
              <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md z-30 flex flex-col items-center justify-center p-8 text-center animate-fadeIn">
                <div className="relative w-28 h-28 mb-6">
                  <div className="absolute inset-0 rounded-full border-4 border-purple-500/15 border-t-purple-500 animate-spin" />
                  <div className="absolute inset-2 rounded-full border-4 border-pink-500/15 border-b-pink-500 animate-spin-slow" />
                  <div className="absolute inset-4 rounded-full border-2 border-indigo-500/20 border-r-indigo-400 animate-pulse" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="text-purple-400 animate-pulse" size={32} />
                  </div>
                </div>
                <div className="space-y-4 max-w-md">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
                      Gemini Generation Pipeline
                    </span>
                    <h4 className="text-xl font-extrabold text-white mt-2">
                      Rendering Persona Model
                    </h4>
                  </div>
                  <div className="w-72 h-3 bg-slate-900 rounded-full overflow-hidden mx-auto border border-slate-800 p-0.5">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 transition-all duration-300 rounded-full shadow-lg shadow-purple-500/50"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-purple-300 font-mono min-h-8 leading-relaxed animate-pulse">
                    {statusMessage || GEMINI_GENERATING_STEPS[generationStep]}
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono">
                    Progress: {progress}%
                  </p>
                </div>
              </div>
            )}

            {/* Header with Switcher Tabs */}
            <div className="border-b border-slate-800/80 px-6 py-4 bg-slate-950/60 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <div className="w-3 h-3 rounded-full bg-green-500/70" />
                <span className="text-xs font-mono text-slate-400 ml-2">
                  Gemini Status:{" "}
                  <span className={isLiveGeminiOutput ? "text-emerald-400 font-bold" : "text-purple-400 font-bold"}>
                    {isLiveGeminiOutput ? "LIVE GEMINI API" : "ACTIVE MODEL RIG"}
                  </span>
                </span>
              </div>

              {/* View Header */}
              <div className="flex bg-slate-900/80 p-1 rounded-xl border border-slate-800 text-xs">
                <span className="px-3 py-1.5 rounded-lg font-semibold bg-purple-600 text-white shadow">
                  📸 Image
                </span>
              </div>
            </div>

            {/* Influencer Profile Card & Output Media */}
            <div className="p-6 md:p-8 flex-1 flex flex-col justify-between space-y-6">
              {/* Top Row: Influencer Profile Summary */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-950/40 border border-slate-800/80">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-[4px]" />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={profile.avatarUrl}
                      alt={profile.name}
                      className="w-14 h-14 rounded-full object-cover relative border-2 border-slate-950 shadow-md"
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center border-2 border-slate-950 text-white text-[9px]">
                      <Sparkles size={10} />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-extrabold text-white text-base flex items-center gap-1.5">
                      {profile.name}
                      <span className="inline-block w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center text-[8px] font-bold">
                        ✓
                      </span>
                    </h4>
                    <p className="text-xs text-purple-400 font-mono">{profile.handle}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{profile.bio.slice(0, 75)}...</p>
                  </div>
                </div>

                {/* Quick stats badge */}
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                    <p className="text-[9px] text-slate-500 font-bold uppercase">Reach</p>
                    <p className="text-xs font-bold text-white">{profile.followers}</p>
                  </div>
                  <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                    <p className="text-[9px] text-slate-500 font-bold uppercase">Engage</p>
                    <p className="text-xs font-bold text-emerald-400">{profile.engagement}</p>
                  </div>
                </div>
              </div>

              {/* Main Media Showcase (Image) */}
              <div className="flex-1 flex flex-col justify-center">
                <div className="relative rounded-2xl overflow-hidden aspect-[4/5] max-h-[460px] bg-slate-900 border border-purple-500/30 group shadow-2xl mx-auto w-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={profile.imageUrl}
                    alt="Gemini Generated Influencer Image"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                  {/* Top badging */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-purple-500/40 text-[10px] font-bold text-purple-300 flex items-center gap-1">
                      <Sparkles size={11} className="text-purple-400" />
                      Gemini Model
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-mono text-slate-300">
                      {aspectRatio}
                    </span>
                  </div>

                  {/* Bottom overlay with prompt & download */}
                  <div className="absolute bottom-0 inset-x-0 p-5 space-y-2">
                    <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed">
                      {profile.postCaption}
                    </p>
                    <div className="flex justify-between items-center pt-2 border-t border-white/10 text-[11px]">
                      <span className="text-slate-400 font-mono">Format: High-Res WebP / JPEG</span>
                      <a
                        href={profile.imageUrl}
                        target="_blank"
                        rel="noreferrer"
                        download="gemini-influencer.jpg"
                        className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-colors cursor-pointer"
                      >
                        View Full Resolution ↗
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Tags and Metadata footer */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/60 text-xs">
                <div className="flex flex-wrap gap-1.5">
                  {profile.tags.map((tag) => (
                    <span key={tag} className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[10px] text-slate-400 font-medium">
                      #{tag.toLowerCase().replace(/\s+/g, "")}
                    </span>
                  ))}
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  Engine: Google Gemini
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
