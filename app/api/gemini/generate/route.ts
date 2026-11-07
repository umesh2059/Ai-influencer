import { NextRequest, NextResponse } from "next/server";
import { submitGeminiGeneration, GeminiGenerationRequest } from "@/lib/gemini";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      prompt,
      aspect_ratio = "1:1",
      model,
      apiKey,
      user_id,
    } = body;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Prompt is required to generate an influencer image." },
        { status: 400 }
      );
    }

    const effectiveApiKey = apiKey || process.env.GEMINI_API_KEY;

    // Check if API key is provided
    if (!effectiveApiKey) {
      // Return a simulated generation with fallback preview notice
      const simulatedId = `sim-${Date.now()}`;
      return NextResponse.json({
        isSimulated: true,
        message: "No GEMINI_API_KEY configured. Running in high-fidelity preview mode.",
        imageGeneration: {
          id: `${simulatedId}-img`,
          state: "completed",
          output: [{ url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85" }],
          model: "gemini-2.0-flash-preview-image-generation",
        },
      });
    }

    const imageParams: GeminiGenerationRequest = {
      prompt,
      aspect_ratio,
      model,
      user_id,
    };
    const imageGen = await submitGeminiGeneration(imageParams, effectiveApiKey);

    return NextResponse.json({
      success: true,
      imageGeneration: imageGen,
    });
  } catch (err: any) {
    const message: string = err?.message || "";

    // Quota / rate-limit errors are expected (e.g. free-tier keys have 0 image quota),
    // so answer with a short 429 instead of Google's long raw message as a 500
    if (/quota|rate.?limit|RESOURCE_EXHAUSTED|\b429\b/i.test(message)) {
      console.warn("Gemini quota exceeded:", message.split("\n")[0]);
      return NextResponse.json(
        {
          error:
            "Your Gemini API key has no image-generation quota left. Enable billing in Google AI Studio or use a different key.",
          code: "QUOTA_EXCEEDED",
        },
        { status: 429 }
      );
    }

    console.error("Gemini Generation Error:", err);
    return NextResponse.json(
      {
        error: err.message || "Failed to submit Gemini generation job.",
        details: err.toString(),
      },
      { status: 500 }
    );
  }
}
