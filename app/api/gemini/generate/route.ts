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
