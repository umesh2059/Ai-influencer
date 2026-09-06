import { NextRequest, NextResponse } from "next/server";
import { getLumaGenerationStatus } from "@/lib/luma";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const apiKey = searchParams.get("apiKey") || undefined;

    if (!id) {
      return NextResponse.json(
        { error: "Generation ID parameter (?id=...) is required" },
        { status: 400 }
      );
    }

    // Handle simulated generation status
    if (id.startsWith("sim-")) {
      const isVideo = id.endsWith("-vid");
      return NextResponse.json({
        id,
        state: "completed",
        output: [
          {
            url: isVideo
              ? "https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-neon-light-40484-large.mp4"
              : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85",
          },
        ],
        model: isVideo ? "ray-3.2" : "uni-1",
        isSimulated: true,
      });
    }

    const effectiveApiKey = apiKey || process.env.LUMA_AGENTS_API_KEY;

    if (!effectiveApiKey) {
      return NextResponse.json(
        { error: "LUMA_AGENTS_API_KEY is not configured" },
        { status: 401 }
      );
    }

    const status = await getLumaGenerationStatus(id, effectiveApiKey);
    return NextResponse.json(status);
  } catch (err: any) {
    console.error("Luma Polling Error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to fetch Luma generation status" },
      { status: 500 }
    );
  }
}
