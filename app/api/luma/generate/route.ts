import { NextRequest, NextResponse } from "next/server";
import { submitLumaGeneration, LumaGenerationRequest } from "@/lib/luma";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      prompt,
      aspect_ratio = "1:1",
      type = "image", // "image" | "video" | "both"
      model,
      videoOptions,
      apiKey,
      user_id,
    } = body;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Prompt is required to generate an influencer model." },
        { status: 400 }
      );
    }

    const effectiveApiKey = apiKey || process.env.LUMA_AGENTS_API_KEY;

    // Check if API key is provided
    if (!effectiveApiKey) {
      // Return simulated generation IDs with fallback preview notice
      const simulatedId = `sim-${Date.now()}`;
      return NextResponse.json({
        isSimulated: true,
        message: "No LUMA_AGENTS_API_KEY configured. Running in high-fidelity preview mode.",
        imageGeneration: type === "image" || type === "both" ? {
          id: `${simulatedId}-img`,
          state: "completed",
          output: [{ url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85" }],
          model: "uni-1",
        } : null,
        videoGeneration: type === "video" || type === "both" ? {
          id: `${simulatedId}-vid`,
          state: "completed",
          output: [{ url: "https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-neon-light-40484-large.mp4" }],
          model: "ray-3.2",
        } : null,
      });
    }

    // Call real Luma Agents API
    let imageGen = null;
    let videoGen = null;

    if (type === "image" || type === "both") {
      const imageParams: LumaGenerationRequest = {
        prompt,
        aspect_ratio,
        model: (model as any) || "uni-1",
        type: "image",
        user_id,
      };
      imageGen = await submitLumaGeneration(imageParams, effectiveApiKey);
    }

    if (type === "video" || type === "both") {
      const videoParams: LumaGenerationRequest = {
        prompt,
        aspect_ratio,
        model: "ray-3.2",
        type: "video",
        video: {
          resolution: videoOptions?.resolution || "720p",
          duration: videoOptions?.duration || "5s",
        },
        user_id,
      };
      videoGen = await submitLumaGeneration(videoParams, effectiveApiKey);
    }

    return NextResponse.json({
      success: true,
      imageGeneration: imageGen,
      videoGeneration: videoGen,
    });
  } catch (err: any) {
    console.error("Luma Generation Error:", err);
    return NextResponse.json(
      {
        error: err.message || "Failed to submit Luma generation job.",
        details: err.toString(),
      },
      { status: 500 }
    );
  }
}
