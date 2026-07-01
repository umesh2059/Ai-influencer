"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Menu, Close } from "./Icons";
import { useAuth } from "./AuthProvider";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { label: "Generator Arena", href: "#demo" },
    { label: "Scheduler Queue", href: "#scheduler" },
    { label: "Core Features", href: "#features" },
    { label: "Pricing Plans", href: "#pricing" },
    { label: "FAQ", href: "#faq" }
  ];

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const handleSignIn = () => {
    router.push("/auth/signin");
  };

  const handleGetStarted = () => {
    if (user) {
      router.push("/dashboard");
    } else {
      router.push("/auth/signin");
    }
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-black/60 backdrop-blur-md border-b border-slate-900/60 py-4 shadow-xl"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center text-white shadow-lg shadow-purple-600/30 group-hover:scale-105 transition-transform duration-300">
            <Sparkles size={18} className="fill-white/10" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white group-hover:text-purple-300 transition-colors duration-300">
            Influencer<span className="text-purple-500 font-extrabold">.AI</span>
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {menuItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors duration-200 relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-purple-500 hover:after:w-full after:transition-all after:duration-300"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-4">
          {loading ? (
            <div className="w-5 h-5 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
          ) : user ? (
            <>
              {/* User info */}
              <button
                onClick={() => router.push("/dashboard")}
                className="flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors duration-200 cursor-pointer"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                  {(
                    user.user_metadata?.full_name?.[0] ||
                    user.email?.[0] ||
                    "U"
                  ).toUpperCase()}
                </div>
                <span className="hidden lg:inline">Dashboard</span>
              </button>
              <button
                onClick={handleSignOut}
                className="py-2.5 px-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-sm font-semibold text-slate-300 hover:text-white transition-all duration-300 cursor-pointer"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleSignIn}
                className="text-sm font-semibold text-slate-300 hover:text-white transition-colors duration-200 cursor-pointer"
              >
                Sign In
              </button>
              <button
                onClick={handleGetStarted}
                className="py-2.5 px-5 rounded-xl bg-purple-600 hover:bg-purple-500 text-sm font-semibold text-white transition-all duration-300 shadow-md shadow-purple-600/25 hover:shadow-purple-500/40 cursor-pointer"
              >
                Start Free
              </button>
            </>
          )}
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          {mobileMenuOpen ? <Close size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-slate-950/95 border-b border-slate-900 backdrop-blur-lg flex flex-col p-6 space-y-4 animate-fade-in-up">
          {menuItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-medium text-slate-300 hover:text-white transition-colors py-2 border-b border-slate-900/50"
            >
              {item.label}
            </a>
          ))}
          <div className="flex flex-col gap-3 pt-2">
            {user ? (
              <>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    router.push("/dashboard");
                  }}
                  className="py-3 text-center rounded-xl border border-slate-800 text-sm font-semibold text-slate-300 hover:text-white hover:border-slate-700 transition-colors cursor-pointer"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleSignOut();
                  }}
                  className="py-3 text-center rounded-xl bg-slate-900 border border-slate-800 text-sm font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleSignIn();
                  }}
                  className="py-3 text-center rounded-xl border border-slate-800 text-sm font-semibold text-slate-300 hover:text-white hover:border-slate-700 transition-colors cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleGetStarted();
                  }}
                  className="py-3 text-center rounded-xl bg-purple-600 hover:bg-purple-500 text-sm font-semibold text-white transition-colors cursor-pointer"
                >
                  Start Free
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
