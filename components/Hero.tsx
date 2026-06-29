import React from "react";
import { Sparkles, Play, ArrowRight, Instagram, TikTok, YouTube, Twitter, Zap, Cpu } from "./Icons";

export default function Hero() {
  return (
    <section className="relative pt-36 pb-20 overflow-hidden bg-grid-pattern">
      {/* Dynamic ambient background glow circles */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse-glow" />
      <div className="absolute top-48 left-10 w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute top-20 right-10 w-[250px] h-[250px] bg-pink-600/10 rounded-full blur-[80px] pointer-events-none" />

      {/* Grid overlay mask to fade background edges */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#030014]/60 to-[#030014] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 text-center space-y-8">
        {/* Release Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel border-purple-500/20 text-purple-400 text-xs font-semibold uppercase tracking-wider animate-float-slow">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
          </span>
          Next-Gen AI Influencer Suite v2.0
        </div>

        {/* Hero Title */}
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.1] md:leading-[1.05]">
          GenAI Influencers. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-500 to-pink-500">
            Scheduled to Go Viral.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-slate-400 text-base md:text-xl max-w-2xl mx-auto leading-relaxed">
          Create custom virtual personas with pixel-perfect look consistency. Autonomously draft copywriting, select trending hashtags, and schedule posts across all platforms.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <a
            href="#demo"
            className="w-full sm:w-auto py-4 px-8 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold shadow-[0_4px_25px_rgba(168,85,247,0.35)] hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
          >
            Start Generating Free
            <ArrowRight size={16} />
          </a>
          <a
            href="#scheduler"
            className="w-full sm:w-auto py-4 px-8 rounded-2xl glass-panel text-slate-300 hover:text-white border-slate-800 hover:border-slate-700 hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play size={14} className="text-purple-400" />
            Watch Scheduler Demo
          </a>
        </div>

        {/* Social Proof Badges */}
        <div className="pt-10 space-y-4">
          <p className="text-xs font-mono uppercase text-slate-500 tracking-widest">Integrating directly with the majors</p>
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 text-slate-400">
            <div className="flex items-center gap-2 hover:text-pink-400 transition-colors">
              <Instagram size={18} />
              <span className="font-semibold text-sm">Instagram</span>
            </div>
            <div className="flex items-center gap-2 hover:text-teal-400 transition-colors">
              <TikTok size={18} />
              <span className="font-semibold text-sm">TikTok</span>
            </div>
            <div className="flex items-center gap-2 hover:text-red-400 transition-colors">
              <YouTube size={18} />
              <span className="font-semibold text-sm">YouTube</span>
            </div>
            <div className="flex items-center gap-2 hover:text-blue-400 transition-colors">
              <Twitter size={18} />
              <span className="font-semibold text-sm">Twitter / X</span>
            </div>
          </div>
        </div>

        {/* Hero Visual Mockup */}
        <div className="pt-16 max-w-5xl mx-auto relative animate-float">
          {/* Glowing border outline */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500 rounded-3xl blur-[8px] opacity-30" />
          
          <div className="relative glass-panel rounded-3xl border-slate-800/80 overflow-hidden shadow-2xl bg-slate-950/80">
            {/* Header topbar */}
            <div className="border-b border-slate-900 px-6 py-4 bg-slate-950/60 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-slate-800" />
                <span className="w-3 h-3 rounded-full bg-slate-800" />
                <span className="w-3 h-3 rounded-full bg-slate-800" />
              </div>
              <span className="text-xs font-mono text-slate-500">dashboard_preview_live.config</span>
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
            </div>

            {/* Dashboard Mockup Grid */}
            <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 text-left">
              {/* Left sidebar simulator stats */}
              <div className="md:col-span-4 space-y-4">
                <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 space-y-3">
                  <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest block">Active Personas</span>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-white">Yuki (Fashion Anime)</span>
                    <span className="text-xs font-semibold text-green-400">Online</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-white">Kai (Tech Cyber)</span>
                    <span className="text-xs font-semibold text-green-400">Online</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-white">Elena (Travel Photo)</span>
                    <span className="text-xs font-semibold text-yellow-500">Rendering</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 space-y-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">System Speed</span>
                  <div className="flex justify-between items-baseline">
                    <span className="text-3xl font-extrabold text-white">4.2s</span>
                    <span className="text-[10px] text-green-400">per post generation</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="w-4/5 h-full bg-gradient-to-r from-purple-500 to-pink-500" />
                  </div>
                </div>
              </div>

              {/* Center Dashboard View */}
              <div className="md:col-span-8 p-6 rounded-2xl bg-slate-900/30 border border-slate-800/80 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                      <Cpu size={18} />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">Campaign Overview</h4>
                      <p className="text-[10px] text-slate-500">Real-time automation metrics across 3 pipelines</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-purple-500/10 border border-purple-500/20 text-[10px] font-mono text-purple-400 font-semibold">
                    AUTO-DISPATCH ON
                  </span>
                </div>

                {/* Graph mockup */}
                <div className="space-y-4">
                  <div className="flex justify-between items-end h-[100px] gap-2 pt-2">
                    {[35, 45, 30, 60, 50, 75, 90, 85, 110, 95, 130].map((val, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                        <div
                          style={{ height: `${val}px` }}
                          className="w-full rounded-t-sm bg-gradient-to-t from-purple-600/40 to-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.15)]"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-[9px] font-mono text-slate-500 px-1 border-t border-slate-800 pt-2">
                    <span>WEEK 1</span>
                    <span>WEEK 2</span>
                    <span>WEEK 3</span>
                    <span>WEEK 4</span>
                  </div>
                </div>

                {/* Bottom stats row */}
                <div className="grid grid-cols-3 gap-4 pt-2">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-slate-500">Impressions</span>
                    <h5 className="text-lg font-bold text-white mt-0.5">2.4M</h5>
                    <span className="text-[9px] text-green-400 font-medium">↑ 34% this month</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-slate-500">CTR (Avg)</span>
                    <h5 className="text-lg font-bold text-white mt-0.5">8.12%</h5>
                    <span className="text-[9px] text-green-400 font-medium">↑ 12% industry avg</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-slate-500">Sponsorships</span>
                    <h5 className="text-lg font-bold text-purple-400 mt-0.5">$14.2K</h5>
                    <span className="text-[9px] text-green-400 font-medium">↑ 8 virtual campaigns</span>
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
