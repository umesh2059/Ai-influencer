import React from "react";
import { Sparkles, Calendar, Analytics, Users, Globe, Settings, Zap } from "./Icons";

export default function Features() {
  const featuresList = [
    {
      icon: Sparkles,
      iconColor: "text-purple-400 bg-purple-500/10 border-purple-500/20",
      tag: "PIXEL-PERFECT LOOKS",
      title: "Ultra-Consistent Face Synthesis",
      description: "Ensure your AI influencer maintains identical facial features, body dimensions, and expressions across all poses, lighting situations, and wardrobe drops.",
      colSpan: "md:col-span-6"
    },
    {
      icon: Calendar,
      iconColor: "text-blue-400 bg-blue-500/10 border-blue-500/20",
      tag: "100% AUTONOMOUS",
      title: "Self-Publishing Schedule Manager",
      description: "Link accounts, define days, and let the scheduler post high-res graphics, vertical reels, and captions at the precise minutes your target demographic is active.",
      colSpan: "md:col-span-6"
    },
    {
      icon: Analytics,
      iconColor: "text-pink-400 bg-pink-500/10 border-pink-500/20",
      tag: "PREDICTIVE SCORE",
      title: "Deep Virality Analytics",
      description: "Analyze hashtags, caption length, lighting, and composition trends. Get a predictive engagement score for every post before it's sent to the dispatcher queue.",
      colSpan: "md:col-span-4"
    },
    {
      icon: Globe,
      iconColor: "text-teal-400 bg-teal-500/10 border-teal-500/20",
      tag: "GLOBAL LOCALIZATION",
      title: "20+ Languages & Accents",
      description: "Generate video scripts, audio recordings, and comments translated and localized in over 20 languages. Expand your virtual influencer's reach globally.",
      colSpan: "md:col-span-4"
    },
    {
      icon: Users,
      iconColor: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
      tag: "ENGAGEMENT SPIKER",
      title: "AI Auto-Comment Responder",
      description: "Double your comment weight automatically. The AI instantly replies to comments in the model's voice to keep community conversations active and boost algorithm ranks.",
      colSpan: "md:col-span-4"
    }
  ];

  return (
    <section id="features" className="py-24 relative overflow-hidden bg-black/40">
      {/* Background blur blobs */}
      <div className="absolute top-1/3 left-10 w-[350px] h-[350px] bg-purple-600/5 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-pink-600/5 rounded-full blur-[90px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel border-purple-500/20 text-purple-400 text-xs font-semibold uppercase tracking-wider">
            <Zap size={14} className="fill-purple-400/20" />
            Platform Capabilities
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
            Engineered for <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Infinite Scale</span>
          </h2>
          <p className="text-slate-400 text-base md:text-lg">
            Traditional influencer agencies spend weeks organizing photoshoots, copywriting, and analyzing data. Our AI model accomplishes this in seconds.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {featuresList.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className={`${feature.colSpan} glass-panel glass-panel-hover rounded-3xl p-8 border-slate-800/80 flex flex-col justify-between transition-all duration-300 relative group`}
              >
                {/* Subtle gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl pointer-events-none" />

                <div className="space-y-6 relative z-10">
                  {/* Icon wrap */}
                  <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${feature.iconColor}`}>
                    <Icon size={22} />
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] font-bold font-mono tracking-widest text-purple-400/80 block">
                      {feature.tag}
                    </span>
                    <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors duration-200">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
