"use client";

import React, { useState } from "react";
import { Sparkles } from "./Icons";

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqItems: FAQItem[] = [
    {
      question: "How does face/appearance consistency work across posts?",
      answer: "We use proprietary diffusion-model training pipelines (LoRAs) paired with structural facial alignment networks. When you create an influencer, the system builds a unique facial embedding topology. This ensures your model maintains identical features, hair styles, and body proportions in every background, pose, or lighting condition."
    },
    {
      question: "Do I fully own the rights to the AI model and generated media?",
      answer: "Yes, 100%. All images, scripts, videos, copy, and influencer names generated on our platform are your intellectual property. You can monetize them, accept brand sponsorships, run ads, and sell merchandise under your influencer's brand without any royalty fees."
    },
    {
      question: "Can I connect multiple social media accounts?",
      answer: "Yes. The Starter plan supports 1 active account per platform, while the Professional plan allows up to 3 connected profiles per social network (Instagram, TikTok, YouTube Shorts, Twitter/X) with individual queues for separate models."
    },
    {
      question: "How does the scheduler optimize the posting time?",
      answer: "Our auto-scheduler monitors live API feeds to track target demographic activity on each network. By analyzing engagement waves, the scheduler deploys content during optimal visibility windows, ensuring your posts aren't buried under standard algorithmic noise."
    },
    {
      question: "Does the platform support automated video and reels generation?",
      answer: "Yes. On our Professional and Enterprise plans, you can generate vertical reels, shorts, and stories. The system writes the script, overlays consistent character visuals, synthesizes realistic voice tracks in 20+ languages, and auto-generates animated captions."
    }
  ];

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 relative overflow-hidden bg-black/40">
      {/* Decors */}
      <div className="absolute top-1/2 left-10 w-[250px] h-[250px] bg-blue-600/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel border-purple-500/20 text-purple-400 text-xs font-semibold uppercase tracking-wider">
            Questions & Answers
          </div>
          <h2 className="text-4xl font-bold tracking-tight text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-400 text-sm md:text-base">
            Everything you need to know about starting, scaling, and scheduling your virtual AI influencer agency.
          </p>
        </div>

        {/* Accordions List */}
        <div className="space-y-4">
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="glass-panel rounded-2xl border-slate-800 overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => handleToggle(index)}
                  className="w-full py-5 px-6 flex items-center justify-between text-left text-white font-semibold text-sm md:text-base hover:bg-white/25 transition-colors duration-200 cursor-pointer"
                >
                  <span>{item.question}</span>
                  <span className={`text-xl transition-transform duration-300 ${isOpen ? "rotate-45 text-purple-400" : "text-slate-400"}`}>
                    ＋
                  </span>
                </button>
                <div
                  className={`transition-all duration-300 ease-in-out ${
                    isOpen ? "max-h-[300px] border-t border-slate-900 px-6 py-4 opacity-100" : "max-h-0 opacity-0 pointer-events-none"
                  }`}
                >
                  <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
