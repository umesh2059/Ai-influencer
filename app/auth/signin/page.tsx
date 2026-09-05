"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Sparkles } from "@/components/Icons";

function SignInContent() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading, signInDemo } = useAuth();

  // If user is already logged in, redirect to dashboard
  useEffect(() => {
    if (!authLoading && user) {
      router.push("/dashboard");
    }
  }, [user, authLoading, router]);

  // Check for error params from OAuth callback
  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam === "auth_callback_error") {
      setError("OAuth authentication failed. Please try again or use email sign-in / demo access.");
    }
  }, [searchParams]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const trimmedEmail = email.trim().toLowerCase();

    // Client-side validations
    if (!trimmedEmail) {
      setError("Please enter your email address.");
      setLoading(false);
      return;
    }

    if (trimmedEmail.endsWith("@example.com") || trimmedEmail.endsWith("@test.com")) {
      setError("Supabase blocks dummy domains like @example.com. Please use a valid email (e.g. yourname@gmail.com) or click 'Instant Demo Access' below.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    const supabase = createClient();

    if (mode === "signup") {
      try {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: trimmedEmail,
          password,
          options: {
            data: {
              full_name: fullName.trim() || undefined,
            },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        if (signUpError) {
          const errMsg = signUpError.message.toLowerCase();
          if (errMsg.includes("rate limit") || (signUpError as any).status === 429) {
            setError(
              "⚠️ Supabase email rate limit reached (free tier allows max 3-4 emails/hr). Please use 'Instant Demo Access' below to enter immediately, or turn off 'Confirm email' in your Supabase Dashboard (Auth -> Providers -> Email)."
            );
          } else if (errMsg.includes("invalid") && errMsg.includes("email")) {
            setError("Email address is invalid or not allowed by Supabase. Please use a standard email provider like Gmail.");
          } else {
            setError(signUpError.message);
          }
        } else if (data?.session) {
          // If Supabase has email confirmation disabled, a session is returned immediately
          router.push("/dashboard");
          return;
        } else {
          setMessage(
            "Account created! Check your email inbox to confirm your account, then come back here to sign in."
          );
        }
      } catch (err: any) {
        setError(err?.message || "An unexpected error occurred during sign up.");
      }
    } else {
      try {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password,
        });

        if (signInError) {
          const errMsg = signInError.message.toLowerCase();
          if (errMsg.includes("invalid login credentials")) {
            setError(
              "Invalid email or password. If you haven't created an account yet, please click 'Create Account' above!"
            );
          } else if (errMsg.includes("email not confirmed")) {
            setError(
              "Please confirm your email via the link sent to your inbox before signing in, or use 'Instant Demo Access' below."
            );
          } else {
            setError(signInError.message);
          }
        } else if (data?.session) {
          router.push("/dashboard");
          return;
        }
      } catch (err: any) {
        setError(err?.message || "An unexpected error occurred during sign in.");
      }
    }

    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setError(error.message);
        setLoading(false);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to initialize Google Sign-In.");
      setLoading(false);
    }
  };

  const handleDemoAccess = () => {
    signInDemo();
    router.push("/dashboard");
  };

  // Show spinner while checking auth state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030014]">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030014] relative overflow-hidden px-4 py-12">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-purple-600/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] bg-pink-600/8 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-10 right-10 w-[300px] h-[300px] bg-blue-600/5 rounded-full blur-[80px] pointer-events-none" />

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

      {/* Card Container */}
      <div className="relative z-10 w-full max-w-md">
        {/* Brand Logo */}
        <div className="text-center mb-6">
          <a href="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center text-white shadow-lg shadow-purple-600/30 group-hover:scale-105 transition-transform duration-300">
              <Sparkles size={20} className="fill-white/10" />
            </div>
            <span className="font-bold text-2xl tracking-tight text-white group-hover:text-purple-300 transition-colors duration-300">
              Influencer
              <span className="text-purple-500 font-extrabold">.AI</span>
            </span>
          </a>
        </div>

        {/* Auth Card */}
        <div className="glass-panel rounded-3xl border border-slate-800/80 p-8 shadow-2xl backdrop-blur-xl">
          {/* Instant Demo Access Button */}
          <button
            type="button"
            onClick={handleDemoAccess}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-purple-900/40 via-pink-900/30 to-purple-900/40 border border-purple-500/40 hover:border-purple-400 text-purple-200 hover:text-white font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2.5 shadow-lg shadow-purple-950/40 hover:shadow-purple-900/60 mb-6 group cursor-pointer"
          >
            <span className="text-base group-hover:scale-110 transition-transform">🚀</span>
            <span>
              Instant Demo Access{" "}
              <span className="text-xs text-purple-400 font-normal block sm:inline">
                (Skip sign-up & get 300 credits)
              </span>
            </span>
          </button>

          {/* Mode Switcher Tabs */}
          <div className="flex rounded-2xl bg-slate-900/80 p-1 mb-6 border border-slate-800">
            <button
              type="button"
              onClick={() => {
                setMode("signin");
                setError(null);
                setMessage(null);
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${
                mode === "signin"
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-purple-900/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("signup");
                setError(null);
                setMessage(null);
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${
                mode === "signup"
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-purple-900/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Title */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-white mb-1.5">
              {mode === "signin" ? "Welcome Back" : "Create Your Account"}
            </h1>
            <p className="text-xs text-slate-400">
              {mode === "signin"
                ? "Enter your credentials to access your influencer studio"
                : "Sign up to begin creating virtual AI influencers"}
            </p>
          </div>

          {/* Google OAuth Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-3 px-4 rounded-2xl bg-white/5 border border-slate-700/80 hover:bg-white/10 hover:border-slate-600 text-white font-medium text-sm transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mb-5"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-5">
            <div className="flex-1 h-px bg-slate-800" />
            <span className="text-[11px] text-slate-500 uppercase tracking-wider font-medium">
              or with email
            </span>
            <div className="flex-1 h-px bg-slate-800" />
          </div>

          {/* Email Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2"
                >
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Alex Rivera"
                  required
                  className="w-full py-3 px-4 rounded-xl bg-slate-900/50 border border-slate-800 text-white placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500/50 transition-all duration-300"
                />
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="creator@gmail.com"
                required
                className="w-full py-3 px-4 rounded-xl bg-slate-900/50 border border-slate-800 text-white placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500/50 transition-all duration-300"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold text-slate-400 uppercase tracking-wider"
                >
                  Password
                </label>
                <span className="text-[11px] text-slate-500">Min. 6 chars</span>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full py-3 px-4 rounded-xl bg-slate-900/50 border border-slate-800 text-white placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500/50 transition-all duration-300"
              />
            </div>

            {/* Error / Success feedback messages */}
            {error && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-xs font-medium leading-relaxed animate-fadeIn">
                {error}
              </div>
            )}
            {message && (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-medium leading-relaxed animate-fadeIn">
                {message}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold text-sm transition-all duration-300 shadow-[0_4px_25px_rgba(168,85,247,0.3)] hover:shadow-[0_4px_30px_rgba(168,85,247,0.45)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : mode === "signin" ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Bottom toggle note */}
          <div className="mt-6 text-center">
            <p className="text-xs text-slate-400">
              {mode === "signin"
                ? "Don't have an account yet?"
                : "Already created an account?"}
              <button
                type="button"
                onClick={() => {
                  setMode(mode === "signin" ? "signup" : "signin");
                  setError(null);
                  setMessage(null);
                }}
                className="ml-2 text-purple-400 hover:text-purple-300 font-semibold transition-colors cursor-pointer"
              >
                {mode === "signin" ? "Create Account" : "Sign In"}
              </button>
            </p>
          </div>
        </div>

        {/* Back to Home Link */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="text-xs text-slate-500 hover:text-slate-400 transition-colors inline-flex items-center gap-1.5"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#030014]">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <SignInContent />
    </Suspense>
  );
}
