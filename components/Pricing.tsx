"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Sparkles } from "./Icons";
import { useAuth } from "./AuthProvider";

export default function Pricing() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annually">("annually");
  const { user } = useAuth();
  const router = useRouter();

  const handlePlanClick = () => {
    if (user) {
      router.push("/dashboard");
    } else {
      router.push("/auth/signin");
    }
  };

  const plans = [
    {
      name: "Starter Creator",
      description: "Perfect for testing ideas and launching your first virtual creator.",
      priceMonthly: 29,
      priceAnnually: 19,
      features: [
        "1 Consistent AI Persona",
        "30 Post generations per month",
        "Auto-scheduling to Instagram & Twitter",
        "Standard predictive analytics",
        "Community Discord support"
      ],
      ctaText: "Start Starter Free",
      isPopular: false,
      glowColor: "border-slate-800"
    },
    {
      name: "Professional Agency",
      description: "For creators & marketers scaling multiple models across all platforms.",
      priceMonthly: 89,
      priceAnnually: 59,
      features: [
        "3 Consistent AI Personas",
        "Unlimited Post generations (Reels & Photos)",
        "Auto-scheduling across all 4 platforms",
        "AI voice & script synthesis",
        "AI Comment Responder (100 replies/day)",
        "Advanced virality prediction score",
        "Priority queue rendering"
      ],
      ctaText: "Upgrade to Professional",
      isPopular: true,
      glowColor: "border-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.15)] bg-slate-950/80"
    },
    {
      name: "Enterprise Brand",
      description: "Dedicated resources for professional advertising pipelines.",
      priceMonthly: 249,
      priceAnnually: 169,
      features: [
        "Unlimited AI Personas",
        "Custom Trained LoRA Models (Your likeness)",
        "Infinite auto-posting & auto-replies",
        "Dedicated rendering GPU clusters",
        "Developer API endpoints",
        "Dedicated Account Manager",
        "Custom legal usage licenses"
      ],
      ctaText: "Contact Sales",
      isPopular: false,
      glowColor: "border-slate-800"
    }
  ];

  return (
    <section id="pricing" className="py-24 relative overflow-hidden bg-black/20">
      {/* Background lights */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel border-purple-500/20 text-purple-400 text-xs font-semibold uppercase tracking-wider">
            Pricing Plans
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
            Simple Billing. <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Uncompromised Power.</span>
          </h2>
          <p className="text-slate-400 text-base md:text-lg">
            Choose a plan that fits your creator agency model. Start for free, upgrade or downgrade anytime.
          </p>

          {/* Toggle */}
          <div className="flex items-center justify-center gap-4 pt-4">
            <span className={`text-sm ${billingPeriod === "monthly" ? "text-white font-bold" : "text-slate-400 font-medium"}`}>
              Billed Monthly
            </span>
            <button
              onClick={() => setBillingPeriod(billingPeriod === "monthly" ? "annually" : "monthly")}
              className="w-12 h-6.5 rounded-full bg-slate-900 border border-slate-800 p-0.5 relative transition-colors duration-300 focus:outline-none cursor-pointer flex items-center"
            >
              <div
                className={`w-5 h-5 rounded-full bg-purple-500 transition-transform duration-300 absolute ${
                  billingPeriod === "annually" ? "translate-x-6" : "translate-x-0.5"
                }`}
              />
            </button>
            <span className={`text-sm flex items-center gap-1.5 ${billingPeriod === "annually" ? "text-white font-bold" : "text-slate-400 font-medium"}`}>
              Billed Annually
              <span className="px-2 py-0.5 rounded bg-purple-500/20 text-[10px] text-purple-400 font-semibold uppercase tracking-wider">
                Save 30%
              </span>
            </span>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
          {plans.map((plan, index) => {
            const price = billingPeriod === "monthly" ? plan.priceMonthly : plan.priceAnnually;
            return (
              <div
                key={index}
                className={`glass-panel rounded-3xl p-8 border flex flex-col justify-between transition-all duration-300 hover:scale-[1.01] hover:border-slate-700/80 relative group ${plan.glowColor}`}
              >
                {plan.isPopular && (
                  <>
                    {/* Glowing highlight stripe */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-md shadow-purple-600/30">
                      <Sparkles size={10} />
                      Most Popular Option
                    </div>
                  </>
                )}

                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed min-h-[36px]">{plan.description}</p>

                  {/* Price */}
                  <div className="my-6 flex items-baseline gap-2">
                    <span className="text-5xl font-extrabold text-white tracking-tight">${price}</span>
                    <span className="text-sm text-slate-500">/ month</span>
                  </div>

                  <hr className="border-slate-800/85 my-6" />

                  {/* Features List */}
                  <ul className="space-y-3.5 text-sm text-slate-300">
                    {plan.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-3">
                        <span className="mt-0.5 w-4 h-4 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 flex-shrink-0">
                          <Check size={10} />
                        </span>
                        <span className="text-xs">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8">
                  <button
                    onClick={handlePlanClick}
                    className={`w-full py-3.5 px-6 rounded-2xl font-semibold text-sm transition-all duration-300 cursor-pointer ${
                      plan.isPopular
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-[0_4px_20px_rgba(168,85,247,0.3)]"
                        : "bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white"
                    }`}
                  >
                    {plan.ctaText}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
