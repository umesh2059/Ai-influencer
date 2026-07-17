"use client";

import { Sparkles, Check, Zap } from "./Icons";

// Define inline SVGs for missing icons to ensure the component is self-contained
const Trash = ({ size = 16, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6m4-6v6" />
  </svg>
);

const Plus = ({ size = 16, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M5 12h14m-7-7v14" />
  </svg>
);

const ImageIcon = ({ size = 16, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
    <circle cx="9" cy="9" r="2" />
    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
  </svg>
);

const Send = ({ size = 16, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m22 2-7 20-4-9-9-4Z" />
    <path d="M22 2 11 13" />
  </svg>
);

const ArrowLeft = ({ size = 16, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m12 19-7-7 7-7m8 7H5" />
  </svg>
);

const Info = ({ size = 16, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4m0-4h.01" />
  </svg>
);
import { createClient } from "@/lib/supabase/client";

// Define option types
type GenderType = "Female" | "Male";
type BodyType = "Slim" | "Athletic" | "Curvy" | "Muscular";
type SkinToneType = "Fair" | "Olive" | "Bronze" | "Dark";
type AgeType = "18-24 (Gen Z)" | "25-34 (Millennial)" | "35-44 (Mature)";
type HairType = 
  | "Long Wavy Blonde" 
  | "Short Pixie Red" 
  | "Bob Cut Black" 
  | "Curly Brunette" 
  | "Braided Dark Brown" 
  | "Silver Buzzcut";
type EyeColorType = "Blue" | "Green" | "Brown" | "Hazel" | "Gray";
type VibeType = 
  | "Casual / Minimalist" 
  | "Cyberpunk / Techwear" 
  | "High-Fashion / Luxury" 
  | "Streetwear / Hypebeast" 
  | "Y2K / Retro" 
  | "Cozy / Cottagecore";

interface Model {
  id: string;
  name: string;
  gender: string;
  body_type: string;
  skin_tone: string;
  age_range: string;
  hair_style: string;
  eye_color: string;
  vibe: string;
  prompt: string;
  portrait_url: string;
  full_body_url: string;
  created_at: string;
}

interface Post {
  id: string;
  model_name: string;
  model_avatar: string;
  caption: string;
  image_url: string;
  platform: string;
  created_at: string;
}

interface InfluencerStudioProps {
  userId: string;
  credits: number;
  onUpdateCredits: (newCredits: number) => void;
  isDbLinked: boolean;
}

// Preset matching images for visual previews
const PORTRAIT_IMAGES: Record<string, Record<string, string>> = {
  Female: {
    "Casual / Minimalist": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80",
    "Cyberpunk / Techwear": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80",
    "High-Fashion / Luxury": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    "Streetwear / Hypebeast": "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80",
    "Y2K / Retro": "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80",
    "Cozy / Cottagecore": "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80",
  },
  Male: {
    "Casual / Minimalist": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80",
    "Cyberpunk / Techwear": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    "High-Fashion / Luxury": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80",
    "Streetwear / Hypebeast": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80",
    "Y2K / Retro": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
    "Cozy / Cottagecore": "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=600&q=80",
  }
};

const BODY_IMAGES: Record<string, Record<string, string>> = {
  Female: {
    "Casual / Minimalist": "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80",
    "Cyberpunk / Techwear": "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80",
    "High-Fashion / Luxury": "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=600&q=80",
    "Streetwear / Hypebeast": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80",
    "Y2K / Retro": "https://images.unsplash.com/photo-1560942485-b2a11cc13456?auto=format&fit=crop&w=600&q=80",
    "Cozy / Cottagecore": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
  },
  Male: {
    "Casual / Minimalist": "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=600&q=80",
    "Cyberpunk / Techwear": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80",
    "High-Fashion / Luxury": "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=80",
    "Streetwear / Hypebeast": "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=600&q=80",
    "Y2K / Retro": "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80",
    "Cozy / Cottagecore": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80",
  }
};

const STEPS = [
  "Formulating visual prompt components...",
  "Calibrating facial topology for consistency...",
  "Applying specific hair fibers & lighting renders...",
  "Simulating body frame and stance geometry...",
  "Finalizing photorealistic 8k render output! 🎉"
];

export default function InfluencerStudio({ userId, credits, onUpdateCredits, isDbLinked }: InfluencerStudioProps) {
  const [view, setView] = useState<"hub" | "create_model" | "create_post">("hub");
  
  // Lists
  const [models, setModels] = useState<Model[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoadingLists, setIsLoadingLists] = useState(true);

  // Form State
  const [modelName, setModelName] = useState("");
  const [gender, setGender] = useState<GenderType>("Female");
  const [bodyType, setBodyType] = useState<BodyType>("Slim");
  const [skinTone, setSkinTone] = useState<SkinToneType>("Fair");
  const [ageRange, setAgeRange] = useState<AgeType>("25-34 (Millennial)");
  const [hairStyle, setHairStyle] = useState<HairType>("Long Wavy Blonde");
  const [eyeColor, setEyeColor] = useState<EyeColorType>("Blue");
  const [vibe, setVibe] = useState<VibeType>("Casual / Minimalist");

  // Post Creator State
  const [selectedModelId, setSelectedModelId] = useState("");
  const [postCaption, setPostCaption] = useState("");
  const [postPlatform, setPostPlatform] = useState("Instagram");
  const [isCreatingPost, setIsCreatingPost] = useState(false);

  // Generation status
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [previewPortrait, setPreviewPortrait] = useState<string | null>(null);
  const [previewBody, setPreviewBody] = useState<string | null>(null);

  // Dynamic Prompt Builder
  const [dynamicPrompt, setDynamicPrompt] = useState("");

  useEffect(() => {
    const prompt = `A premium Dribbble-style studio portrait and full-body photograph of a beautiful ${ageRange.toLowerCase()} ${gender.toLowerCase()} influencer named ${modelName || "Model"}. Features: ${bodyType.toLowerCase()} build, ${skinTone.toLowerCase()} skin tone, ${hairStyle.toLowerCase()} hair, and stunning ${eyeColor.toLowerCase()} eyes. Wearing highly detailed ${vibe.toLowerCase()} outfit. Masterpiece, volumetric lighting, photorealistic 8k resolution.`;
    setDynamicPrompt(prompt);
  }, [modelName, gender, bodyType, skinTone, ageRange, hairStyle, eyeColor, vibe]);

  // Load existing data
  useEffect(() => {
    fetchUserData();
  }, [userId]);

  const fetchUserData = async () => {
    setIsLoadingLists(true);
    const supabase = createClient();
    
    let loadedModels: Model[] = [];
    let loadedPosts: Post[] = [];

    // 1. Try to load models from DB
    try {
      const { data: dbModels, error: dbError } = await supabase
        .from("models")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (!dbError && dbModels) {
        loadedModels = dbModels;
      } else {
        throw new Error("Failed to load models from DB");
      }
    } catch (e) {
      // Fallback to local storage
      const localModels = localStorage.getItem(`ai_models_${userId}`);
      if (localModels) {
        loadedModels = JSON.parse(localModels);
      }
    }

    // 2. Try to load posts from DB
    try {
      const { data: dbPosts, error: dbError } = await supabase
        .from("posts")
        .select(`
          id,
          caption,
          image_url,
          platform,
          created_at,
          models (
            name,
            portrait_url
          )
        `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (!dbError && dbPosts) {
        loadedPosts = dbPosts.map((p: any) => ({
          id: p.id,
          caption: p.caption,
          image_url: p.image_url,
          platform: p.platform,
          created_at: p.created_at,
          model_name: p.models?.name || "AI Model",
          model_avatar: p.models?.portrait_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80"
        }));
      } else {
        throw new Error("Failed to load posts from DB");
      }
    } catch (e) {
      // Fallback to local storage
      const localPosts = localStorage.getItem(`ai_posts_${userId}`);
      if (localPosts) {
        loadedPosts = JSON.parse(localPosts);
      }
    }

    setModels(loadedModels);
    setPosts(loadedPosts);
    setIsLoadingLists(false);
  };

  // Create Model Handler
  const handleCreateModel = async () => {
    if (!modelName.trim()) {
      alert("Please enter an influencer name.");
      return;
    }

    if (credits < 50) {
      alert("Insufficient credits! You need at least 50 credits to generate an influencer model.");
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setGenerationStep(0);

    // Simulate progress bar and step messages
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const nextProgress = prev + 4;
        const currentStep = Math.min(
          Math.floor((nextProgress / 100) * STEPS.length),
          STEPS.length - 1
        );
        setGenerationStep(currentStep);
        return nextProgress;
      });
    }, 120);

    // After animation, generate and deduct
    setTimeout(async () => {
      const portraitUrl = PORTRAIT_IMAGES[gender][vibe] || PORTRAIT_IMAGES[gender]["Casual / Minimalist"];
      const bodyUrl = BODY_IMAGES[gender][vibe] || BODY_IMAGES[gender]["Casual / Minimalist"];

      setPreviewPortrait(portraitUrl);
      setPreviewBody(bodyUrl);
      setIsGenerating(false);

      // Deduct Credits
      const newCredits = credits - 50;
      onUpdateCredits(newCredits);

      // Save Model
      const newModel: Model = {
        id: Math.random().toString(36).substring(2, 9),
        name: modelName,
        gender,
        body_type: bodyType,
        skin_tone: skinTone,
        age_range: ageRange,
        hair_style: hairStyle,
        eye_color: eyeColor,
        vibe,
        prompt: dynamicPrompt,
        portrait_url: portraitUrl,
        full_body_url: bodyUrl,
        created_at: new Date().toISOString()
      };

      // Try database insert
      const supabase = createClient();
      try {
        const { error } = await supabase.from("models").insert({
          id: newModel.id,
          user_id: userId,
          name: newModel.name,
          gender: newModel.gender,
          body_type: newModel.body_type,
          skin_tone: newModel.skin_tone,
          age_range: newModel.age_range,
          hair_style: newModel.hair_style,
          eye_color: newModel.eye_color,
          vibe: newModel.vibe,
          prompt: newModel.prompt,
          portrait_url: newModel.portrait_url,
          full_body_url: newModel.full_body_url
        });

        if (error) throw error;
        
        // Also deduct in db
        await supabase.from("profiles").update({ credits: newCredits }).eq("id", userId);
      } catch (dbErr) {
        // Local persistence fallback
        const updatedLocalModels = [newModel, ...models];
        localStorage.setItem(`ai_models_${userId}`, JSON.stringify(updatedLocalModels));
      }

      setModels(prev => [newModel, ...prev]);
    }, 3500);
  };

  // Delete Model
  const handleDeleteModel = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this influencer model?")) return;

    const supabase = createClient();
    try {
      const { error } = await supabase.from("models").delete().eq("id", id);
      if (error) throw error;
    } catch (e) {
      // Local storage edit
      const updatedModels = models.filter(m => m.id !== id);
      localStorage.setItem(`ai_models_${userId}`, JSON.stringify(updatedModels));
    }

    setModels(prev => prev.filter(m => m.id !== id));
  };

  // Create Post Handler
  const handleCreatePost = async () => {
    if (!selectedModelId) {
      alert("Please select an AI Model.");
      return;
    }
    if (!postCaption.trim()) {
      alert("Please enter a caption for your post.");
      return;
    }

    setIsCreatingPost(true);

    setTimeout(async () => {
      const model = models.find(m => m.id === selectedModelId)!;
      const newPost: Post = {
        id: Math.random().toString(36).substring(2, 9),
        model_name: model.name,
        model_avatar: model.portrait_url,
        caption: postCaption,
        image_url: model.full_body_url, // uses model's generated body picture
        platform: postPlatform,
        created_at: new Date().toISOString()
      };

      const supabase = createClient();
      try {
        const { error } = await supabase.from("posts").insert({
          id: newPost.id,
          user_id: userId,
          model_id: selectedModelId,
          caption: newPost.caption,
          image_url: newPost.image_url,
          platform: newPost.platform
        });
        if (error) throw error;
      } catch (dbErr) {
        // Fallback local storage
        const updatedLocalPosts = [newPost, ...posts];
        localStorage.setItem(`ai_posts_${userId}`, JSON.stringify(updatedLocalPosts));
      }

      setPosts(prev => [newPost, ...prev]);
      setIsCreatingPost(false);
      setPostCaption("");
      setView("hub");
    }, 1500);
  };

  return (
    <div className="space-y-8">
      {/* Header Info */}
      {!isDbLinked && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-center gap-3">
          <Info size={16} className="text-amber-400 shrink-0" />
          <div>
            <span className="font-bold">Sandbox Mode:</span> Database columns (`credits`, `models`, `posts`) are missing. 
            All modifications will persist in browser local storage. Run `schema.sql` in your Supabase SQL editor to link fully.
          </div>
        </div>
      )}

      {/* Main Views */}
      {view === "hub" && (
        <div className="space-y-10 animate-fadeIn">
          {/* Action cards row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Add New Model */}
            <div 
              onClick={() => {
                setModelName("");
                setPreviewPortrait(null);
                setPreviewBody(null);
                setView("create_model");
              }}
              className="group p-8 rounded-3xl bg-slate-950/40 border border-slate-900 hover:border-purple-500/50 transition-all duration-300 cursor-pointer flex flex-col justify-between hover:shadow-[0_0_30px_rgba(168,85,247,0.1)]"
            >
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform duration-300">
                  <Plus size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">Add New Model</h3>
                  <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                    Configure character parameters, aesthetics, hair styles, eye colors, and vibes. Build custom AI influencer personas.
                  </p>
                </div>
              </div>
              <span className="text-xs text-purple-400 font-bold mt-8 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Start building <span className="text-sm">→</span>
              </span>
            </div>

            {/* Create New Post */}
            <div 
              onClick={() => {
                if (models.length === 0) {
                  alert("Please create an AI Influencer Model first before generating posts!");
                  return;
                }
                setSelectedModelId(models[0].id);
                setView("create_post");
              }}
              className="group p-8 rounded-3xl bg-slate-950/40 border border-slate-900 hover:border-pink-500/50 transition-all duration-300 cursor-pointer flex flex-col justify-between hover:shadow-[0_0_30px_rgba(236,72,153,0.1)]"
            >
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 group-hover:scale-110 transition-transform duration-300">
                  <ImageIcon size={22} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-pink-400 transition-colors">Create New Post</h3>
                  <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                    Generate visual content feed posts using your active AI personas, tailoring custom social media captions.
                  </p>
                </div>
              </div>
              <span className="text-xs text-pink-400 font-bold mt-8 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Generate feed post <span className="text-sm">→</span>
              </span>
            </div>
          </div>

          {/* Lists Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Model List (Left) */}
            <div className="lg:col-span-7 bg-slate-950/20 border border-slate-900 rounded-3xl p-6 space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-extrabold text-lg text-white">Your AI Models</h3>
                  <p className="text-xs text-slate-500">Active virtual personas</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-[10px] font-bold text-purple-400">
                  {models.length} Total
                </span>
              </div>

              {isLoadingLists ? (
                <div className="py-12 flex justify-center">
                  <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : models.length === 0 ? (
                <div className="py-12 text-center border border-dashed border-slate-900 rounded-2xl">
                  <Plus className="mx-auto text-slate-600 mb-3" size={24} />
                  <p className="text-slate-400 text-sm font-semibold">No models generated yet</p>
                  <p className="text-slate-600 text-xs mt-1">Create your first model to generate visual content</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {models.map((model) => (
                    <div 
                      key={model.id}
                      className="group relative p-4 rounded-2xl bg-slate-950/60 border border-slate-900 hover:border-slate-800 transition-all duration-300 flex items-center gap-4 overflow-hidden"
                    >
                      <img 
                        src={model.portrait_url} 
                        alt={model.name} 
                        className="w-14 h-14 rounded-xl object-cover border border-slate-800"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm text-white truncate flex items-center gap-1">
                          {model.name}
                          <span className="w-3.5 h-3.5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[7px]">✓</span>
                        </h4>
                        <p className="text-[10px] text-purple-400 font-semibold mt-0.5">{model.vibe.split("/")[0]}</p>
                        <p className="text-[9px] text-slate-500 truncate mt-1">{model.age_range.split(" ")[0]} | {model.gender}</p>
                      </div>
                      <button 
                        onClick={(e) => handleDeleteModel(model.id, e)}
                        className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                      >
                        <Trash size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Generated Posts List (Right) */}
            <div className="lg:col-span-5 bg-slate-950/20 border border-slate-900 rounded-3xl p-6 space-y-6">
              <div>
                <h3 className="font-extrabold text-lg text-white">Generated Posts</h3>
                <p className="text-xs text-slate-500">Latest social feeds created</p>
              </div>

              {isLoadingLists ? (
                <div className="py-12 flex justify-center">
                  <div className="w-6 h-6 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : posts.length === 0 ? (
                <div className="py-12 text-center border border-dashed border-slate-900 rounded-2xl">
                  <ImageIcon className="mx-auto text-slate-600 mb-3" size={22} />
                  <p className="text-slate-400 text-sm font-semibold">No feed posts generated yet</p>
                  <p className="text-slate-600 text-xs mt-1">Select one of your models to create content</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {posts.map((post) => (
                    <div 
                      key={post.id}
                      className="p-4 rounded-2xl bg-slate-950/60 border border-slate-900 space-y-3"
                    >
                      <div className="flex items-center gap-3">
                        <img src={post.model_avatar} alt="" className="w-8 h-8 rounded-full object-cover border border-slate-800" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-xs text-white">{post.model_name}</h4>
                          <span className="text-[9px] text-slate-500 block">{post.platform} • {new Date(post.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="relative rounded-xl overflow-hidden aspect-[4/5] bg-slate-900 border border-slate-900">
                        <img src={post.image_url} alt="" className="w-full h-full object-cover" />
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed line-clamp-2">
                        {post.caption}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* View: Create Model */}
      {view === "create_model" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch animate-fadeIn">
          {/* Controls Panel */}
          <div className="lg:col-span-7 bg-slate-950/40 border border-slate-900/80 rounded-3xl p-6 md:p-8 flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              {/* Back & Title */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-900/60">
                <button 
                  onClick={() => setView("hub")}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <ArrowLeft size={14} /> Back to Hub
                </button>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-[10px] font-bold text-purple-400 uppercase tracking-wide">
                  <Sparkles size={12} /> Model Studio
                </div>
              </div>

              {/* 1. Influencer Name */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  1. Influencer Name
                </label>
                <input 
                  type="text" 
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                  placeholder="e.g. Aria Sterling"
                  className="w-full bg-slate-900/40 border border-slate-800 focus:border-purple-500/80 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-all duration-300"
                />
              </div>

              {/* 2. Select Gender */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  2. Gender
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {([
                    { id: "Female", label: "Female", emoji: "👩" },
                    { id: "Male", label: "Male", emoji: "👨" }
                  ] as const).map((g) => (
                    <button
                      key={g.id}
                      onClick={() => setGender(g.id)}
                      className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
                        gender === g.id
                          ? "bg-purple-600/20 border-purple-500 text-purple-200 shadow-[0_0_15px_rgba(147,51,234,0.15)]"
                          : "bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                      }`}
                    >
                      <span>{g.emoji}</span>
                      <span>{g.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Body Type */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  3. Body Type
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {([
                    { id: "Slim", label: "Slim", emoji: "🧍‍♀️" },
                    { id: "Athletic", label: "Athletic", emoji: "💪" },
                    { id: "Curvy", label: "Curvy", emoji: "⏳" },
                    { id: "Muscular", label: "Muscular", emoji: "🏋️" }
                  ] as const).map((b) => (
                    <button
                      key={b.id}
                      onClick={() => setBodyType(b.id)}
                      className={`py-2.5 px-2 rounded-xl border text-xs font-medium transition-all duration-200 cursor-pointer flex flex-col items-center gap-1.5 ${
                        bodyType === b.id
                          ? "bg-purple-600/20 border-purple-500 text-purple-200"
                          : "bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                      }`}
                    >
                      <span className="text-lg">{b.emoji}</span>
                      <span>{b.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Skin Tone */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  4. Skin Tone
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: "Fair", label: "Fair", color: "bg-[#F5D0C5]", border: "border-orange-200" },
                    { id: "Olive", label: "Olive", color: "bg-[#E6C29E]", border: "border-amber-300" },
                    { id: "Bronze", label: "Bronze", color: "bg-[#C68D5F]", border: "border-amber-600" },
                    { id: "Dark", label: "Dark", color: "bg-[#694833]", border: "border-amber-900" }
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSkinTone(s.id as SkinToneType)}
                      className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all duration-200 cursor-pointer flex items-center gap-2.5 ${
                        skinTone === s.id
                          ? "bg-purple-600/20 border-purple-500 text-purple-200"
                          : "bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                      }`}
                    >
                      <span className={`w-3.5 h-3.5 rounded-full ${s.color} border ${s.border}`} />
                      <span>{s.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 5. Age Range */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  5. Age Range
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {(["18-24 (Gen Z)", "25-34 (Millennial)", "35-44 (Mature)"] as const).map((a) => (
                    <button
                      key={a}
                      onClick={() => setAgeRange(a)}
                      className={`py-2.5 px-3 rounded-xl border text-xs font-medium transition-all duration-200 cursor-pointer ${
                        ageRange === a
                          ? "bg-purple-600/20 border-purple-500 text-purple-200"
                          : "bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                      }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              {/* 6. Hair Style & Color */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  6. Hair Style & Color
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(["Long Wavy Blonde", "Short Pixie Red", "Bob Cut Black", "Curly Brunette", "Braided Dark Brown", "Silver Buzzcut"] as const).map((h) => (
                    <button
                      key={h}
                      onClick={() => setHairStyle(h)}
                      className={`py-2.5 px-2 rounded-xl border text-[11px] font-medium transition-all duration-200 cursor-pointer ${
                        hairStyle === h
                          ? "bg-purple-600/20 border-purple-500 text-purple-200"
                          : "bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                      }`}
                    >
                      {h}
                    </button>
                  ))}
                </div>
              </div>

              {/* 7. Eye Color */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  7. Eye Color
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {[
                    { id: "Blue", color: "bg-blue-500" },
                    { id: "Green", color: "bg-emerald-600" },
                    { id: "Brown", color: "bg-amber-800" },
                    { id: "Hazel", color: "bg-[#A78B4C]" },
                    { id: "Gray", color: "bg-slate-400" }
                  ].map((e) => (
                    <button
                      key={e.id}
                      onClick={() => setEyeColor(e.id as EyeColorType)}
                      className={`py-2 px-2.5 rounded-xl border text-xs font-medium transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
                        eyeColor === e.id
                          ? "bg-purple-600/20 border-purple-500 text-purple-200"
                          : "bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                      }`}
                    >
                      <span className={`w-3 h-3 rounded-full ${e.color} border border-white/10`} />
                      <span>{e.id}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 8. Vibe / Aesthetic */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  8. Vibe & Aesthetic Style
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: "Casual / Minimalist", emoji: "🌿" },
                    { id: "Cyberpunk / Techwear", emoji: "⚡" },
                    { id: "High-Fashion / Luxury", emoji: "💎" },
                    { id: "Streetwear / Hypebeast", emoji: "🛹" },
                    { id: "Y2K / Retro", emoji: "📺" },
                    { id: "Cozy / Cottagecore", emoji: "☕" }
                  ].map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setVibe(v.id as VibeType)}
                      className={`py-2.5 px-2 rounded-xl border text-xs font-medium transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 ${
                        vibe === v.id
                          ? "bg-purple-600/20 border-purple-500 text-purple-200"
                          : "bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                      }`}
                    >
                      <span>{v.emoji}</span>
                      <span>{v.id.split(" / ")[0]}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Prompt Builder & Generate Action */}
            <div className="pt-6 border-t border-slate-900/60 space-y-4">
              <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80">
                <p className="text-[10px] font-bold text-purple-400 uppercase tracking-wider mb-2">Live Dynamic Prompt Builder</p>
                <p className="text-[11px] font-mono text-slate-300 leading-relaxed h-14 overflow-y-auto">{dynamicPrompt}</p>
              </div>

              <button
                onClick={handleCreateModel}
                disabled={isGenerating}
                className="w-full relative py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 hover:from-purple-500 hover:via-fuchsia-500 hover:to-pink-500 text-white font-semibold transition-all duration-300 shadow-[0_4px_25px_rgba(168,85,247,0.3)] hover:shadow-[0_4px_30px_rgba(168,85,247,0.5)] flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group overflow-hidden"
              >
                <div className="absolute inset-0 w-1/2 h-full bg-white/10 skew-x-[-25deg] -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-out" />
                <Sparkles size={18} className={isGenerating ? "animate-spin" : "animate-bounce"} />
                {isGenerating ? "Synthesizing AI Influencer..." : "Generate Influencer (Deducts 50 Credits)"}
              </button>
            </div>
          </div>

          {/* Dribbble Preview Column */}
          <div className="lg:col-span-5 bg-slate-950/40 border border-slate-900/80 rounded-3xl p-6 md:p-8 flex flex-col justify-between relative overflow-hidden min-h-[500px]">
            {isGenerating && (
              <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md z-20 flex flex-col items-center justify-center p-8">
                <div className="relative w-24 h-24 mb-6">
                  <div className="absolute inset-0 rounded-full border-4 border-purple-500/10 border-t-purple-500 animate-spin" />
                  <div className="absolute inset-2 rounded-full border-4 border-pink-500/10 border-b-pink-500 animate-spin-slow" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="text-purple-400 animate-pulse" size={28} />
                  </div>
                </div>
                <div className="text-center space-y-3 max-w-xs">
                  <h4 className="text-base font-bold text-white">Synthesizing {modelName || "AI Persona"}</h4>
                  <div className="w-48 h-2 bg-slate-800 rounded-full overflow-hidden mx-auto">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 transition-all duration-100 rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-purple-400 font-mono h-6 animate-pulse">
                    {STEPS[generationStep]}
                  </p>
                  <p className="text-[10px] text-slate-500">{progress}% completed</p>
                </div>
              </div>
            )}

            <div className="h-full flex flex-col justify-between space-y-6">
              <div className="border-b border-slate-900/60 pb-3 flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400">Live Preview Output</span>
                <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" /> Ready
                </span>
              </div>

              {previewPortrait && previewBody ? (
                <div className="grid grid-cols-2 gap-4 flex-1 items-center">
                  {/* Portrait Column */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block text-center">Portrait Focus</span>
                    <div className="relative rounded-2xl overflow-hidden aspect-[3/4] border border-slate-850 group">
                      <img src={previewPortrait} alt="Portrait focus" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                        <span className="text-[10px] text-white font-semibold">Face Consistency Detail</span>
                      </div>
                    </div>
                  </div>

                  {/* Full Body Column */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block text-center">Full Body Outfit</span>
                    <div className="relative rounded-2xl overflow-hidden aspect-[3/4] border border-slate-850 group">
                      <img src={previewBody} alt="Full Body outfit" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                        <span className="text-[10px] text-white font-semibold">{vibe.split(" / ")[0]} Clothing</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border border-dashed border-slate-850 rounded-2xl my-4">
                  <ImageIcon size={42} className="text-slate-700 mb-3" />
                  <p className="text-sm font-semibold text-slate-400">No generated influencer yet</p>
                  <p className="text-xs text-slate-500 mt-1 max-w-[200px] mx-auto">
                    Fill out the traits on the left and click Generate to see the consistent portraits.
                  </p>
                </div>
              )}

              <div className="pt-4 border-t border-slate-900/60 flex items-center justify-between text-xs text-slate-500">
                <span>Dribbble-Style Render V2</span>
                <span>8K Consistent Resolution</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View: Create Post */}
      {view === "create_post" && (
        <div className="max-w-2xl mx-auto bg-slate-950/40 border border-slate-900 rounded-3xl p-6 md:p-8 space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between pb-4 border-b border-slate-900/60">
            <button 
              onClick={() => setView("hub")}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft size={14} /> Back to Hub
            </button>
            <h3 className="font-bold text-white text-base">Generate New Post</h3>
          </div>

          <div className="space-y-4">
            {/* Select Model */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Select AI Model Persona</label>
              <select 
                value={selectedModelId}
                onChange={(e) => setSelectedModelId(e.target.value)}
                className="w-full bg-slate-900/60 border border-slate-850 focus:border-pink-500/80 rounded-xl px-4 py-3 text-sm text-white focus:outline-none cursor-pointer"
              >
                {models.map(m => (
                  <option key={m.id} value={m.id}>{m.name} ({m.vibe.split(" / ")[0]})</option>
                ))}
              </select>
            </div>

            {/* Select Platform */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Publish Platform</label>
              <div className="grid grid-cols-3 gap-2">
                {["Instagram", "TikTok", "YouTube"].map((p) => (
                  <button
                    key={p}
                    onClick={() => setPostPlatform(p)}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold cursor-pointer ${
                      postPlatform === p
                        ? "bg-pink-600/20 border-pink-500 text-pink-200"
                        : "bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Post Caption */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Write Post Caption</label>
              <textarea 
                rows={4}
                value={postCaption}
                onChange={(e) => setPostCaption(e.target.value)}
                placeholder="e.g. Golden hour shot in Milan wearing custom streetwear gears! #AI #Streetwear #Luxury"
                className="w-full bg-slate-900/60 border border-slate-850 focus:border-pink-500/80 rounded-xl px-4 py-3 text-sm text-white focus:outline-none resize-none leading-relaxed"
              />
            </div>
          </div>

          <button
            onClick={handleCreatePost}
            disabled={isCreatingPost}
            className="w-full relative py-3.5 px-6 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-semibold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Send size={16} className={isCreatingPost ? "animate-spin" : ""} />
            {isCreatingPost ? "Creating Post..." : "Generate and Deploy Post"}
          </button>
        </div>
      )}
    </div>
  );
}
