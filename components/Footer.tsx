"use client";

import React from "react";
import { Sparkles, Instagram, TikTok, YouTube, Twitter } from "./Icons";

export default function Footer() {
  return (
    <footer className="border-t border-slate-900 bg-slate-950/60 pt-16 pb-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-900">
        
        {/* Brand Block */}
        <div className="md:col-span-4 space-y-4">
          <a href="#" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center text-white shadow-md">
              <Sparkles size={16} />
            </div>
            <span className="font-bold text-lg text-white">
              Influencer<span className="text-purple-500 font-extrabold">.AI</span>
            </span>
          </a>
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
            Automating high-quality virtual creator content pipelines. Synthesize consistent faces, auto-write localized captions, and publish autonomously to go viral.
          </p>
          
          {/* Social icons */}
          <div className="flex items-center gap-3 pt-2">
            {[Instagram, TikTok, YouTube, Twitter].map((Icon, idx) => (
              <a
                key={idx}
                href="#"
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 hover:scale-105 transition-all duration-200"
              >
                <Icon size={14} />
              </a>
            ))}
          </div>
        </div>

        {/* Links Grid */}
        <div className="md:col-span-5 grid grid-cols-3 gap-6">
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Product</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#demo" className="hover:text-white transition-colors">Generator</a></li>
              <li><a href="#scheduler" className="hover:text-white transition-colors">Scheduler</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
            </ul>
          </div>
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Resources</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors">Virality Guide</a></li>
              <li><a href="#" className="hover:text-white transition-colors">API Reference</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Sponsorships</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
            </ul>
          </div>
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Company</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog Postings</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Use</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        {/* Newsletter Block */}
        <div className="md:col-span-3 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Stay Updated</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Get the latest insights on virtual influencer trends, platform changes, and virality metrics.
          </p>
          <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Enter email"
              required
              className="flex-1 py-2 px-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
            />
            <button
              type="submit"
              onClick={() => alert("Subscribed to the newsletter!")}
              className="py-2 px-4 rounded-lg bg-purple-600 hover:bg-purple-500 text-xs font-semibold text-white transition-colors cursor-pointer"
            >
              Join
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Sub-Footer */}
      <div className="max-w-7xl mx-auto px-6 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-[10px] text-slate-500">
          © 2026 Influencer.AI. Built for virtual creators globally.
        </span>
        <div className="flex gap-6 text-[10px] text-slate-500">
          <a href="#" className="hover:underline">Terms of Service</a>
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Sitemap</a>
        </div>
      </div>
    </footer>
  );
}
