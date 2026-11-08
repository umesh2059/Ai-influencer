import { NextRequest, NextResponse } from "next/server";
import { generateGeminiVideo, GeminiVideoError, GeminiVideoRequest } from "@/lib/gemini-video";
import { isQuotaError } from "@/lib/gemini";

export const runtime = "nodejs";
// Video generation can take a few minutes (only enforced on hosts like Vercel)
export const maxDuration = 300;

/**
 * POST { prompt, aspect_ratio?, duration?, apiKey?, reference_image? (data URL) }
 * Success: the raw MP4 bytes (Content-Type: video/mp4)
 * Otherwise: JSON { isSimulated } or { error, code }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, aspect_ratio, duration, apiKey, reference_image } = body;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Prompt is required to generate an influencer video." },
        { status: 400 }
      );
    }

    const effectiveApiKey = apiKey || process.env.GEMINI_API_KEY;
    if (!effectiveApiKey) {
      return NextResponse.json({
        isSimulated: true,
        message: "No GEMINI_API_KEY configured. Showing a sample preview instead of a generated video.",
      });
    }

    // Optional image to animate, sent as a data URL ("data:image/png;base64,....")
    let referenceImage: GeminiVideoRequest["reference_image"];
    if (typeof reference_image === "string") {
      const match = reference_image.match(/^data:(image\/[a-z+.-]+);base64,(.+)$/i);
      if (match) referenceImage = { mime_type: match[1], data: match[2] };
    }

    const video = await generateGeminiVideo(
      {
        prompt: prompt.slice(0, 2000),
        aspect_ratio: aspect_ratio === "16:9" ? "16:9" : "9:16",
        duration: Number(duration) || 5,
        reference_image: referenceImage,
      },
      effectiveApiKey
    );

    return new Response(new Uint8Array(video.data), {
      headers: {
        "Content-Type": video.mimeType,
        "Content-Length": String(video.data.length),
        "X-Gemini-Model": video.model,
      },
    });
  } catch (err: any) {
    const message: string = err?.message || "";
    const status = err instanceof GeminiVideoError ? err.status : 500;

    if (status === 429 || isQuotaError(message)) {
      console.warn("Gemini video quota exceeded:", message.split("\n")[0]);
      return NextResponse.json(
        {
          error:
            "Your Gemini API key has no video-generation quota left. Enable billing in Google AI Studio or use a different key.",
          code: "QUOTA_EXCEEDED",
        },
        { status: 429 }
      );
    }

    if (status === 404) {
      return NextResponse.json(
        { error: "The Gemini video model is not available for this API key.", code: "MODEL_UNAVAILABLE" },
        { status: 503 }
      );
    }

    if (err?.name === "TimeoutError") {
      return NextResponse.json(
        { error: "Video generation took too long and was stopped. Try a shorter video.", code: "TIMEOUT" },
        { status: 504 }
      );
    }

    console.error("Gemini Video Generation Error:", err);
    return NextResponse.json(
      { error: message || "Failed to generate video with Gemini.", code: "VIDEO_FAILED" },
      { status: status >= 400 && status < 600 ? status : 500 }
    );
  }
}
