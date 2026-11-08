/**
 * Google Gemini video generation helper (Gemini Omni Flash, via the Interactions API).
 * Veo was shut down in the Gemini API on Oct 22, 2026; Omni Flash replaced it.
 * Docs: https://aistudio.google.com/docs/omni
 */

import { GEMINI_BASE_URL } from "./gemini";

export const GEMINI_VIDEO_MODEL = "gemini-omni-1.2-flash";

export interface GeminiVideoRequest {
  prompt: string;
  aspect_ratio?: "9:16" | "16:9";
  /** Length in seconds, 3-15 */
  duration?: number;
  resolution?: "360p" | "720p" | "1080p";
  /** Optional image the video should animate (e.g. a previously generated influencer image) */
  reference_image?: { data: string; mime_type: string };
  model?: string;
}

export interface GeminiVideoResult {
  data: Buffer;
  mimeType: string;
  model: string;
}

/** Error that keeps Google's HTTP status, so the route can tell quota errors apart. */
export class GeminiVideoError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = "GeminiVideoError";
  }
}

interface VideoContent {
  type?: string;
  data?: string;
  uri?: string;
  mime_type?: string;
  mimeType?: string;
}

/** Finds the video in the response: steps[] → type "model_output" → content[] → type "video" */
function findVideoContent(response: any): VideoContent | undefined {
  const steps: any[] = Array.isArray(response?.steps) ? response.steps : [];
  const outputSteps = [
    ...steps.filter((s) => s?.type === "model_output"),
    ...steps.filter((s) => s?.type !== "model_output"),
  ];
  for (const step of outputSteps) {
    const content: VideoContent[] = Array.isArray(step?.content) ? step.content : [];
    const video = content.find(
      (c) => c?.type === "video" || (c?.mime_type || c?.mimeType || "").startsWith("video/")
    );
    if (video && (video.data || video.uri)) return video;
  }
  return undefined;
}

export async function generateGeminiVideo(
  params: GeminiVideoRequest,
  apiKey?: string
): Promise<GeminiVideoResult> {
  const token = apiKey || process.env.GEMINI_API_KEY;
  if (!token) {
    throw new GeminiVideoError("GEMINI_API_KEY is not configured.", 400);
  }

  const model = params.model || GEMINI_VIDEO_MODEL;
  const duration = Math.min(15, Math.max(3, Math.round(params.duration ?? 5)));

  // With a reference image, input becomes [image, text]; otherwise a plain prompt string
  const input = params.reference_image
    ? [
        {
          type: "image",
          data: params.reference_image.data,
          mime_type: params.reference_image.mime_type,
        },
        { type: "text", text: params.prompt },
      ]
    : params.prompt;

  const response = await fetch(`${GEMINI_BASE_URL}/interactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": token,
    },
    body: JSON.stringify({
      model,
      input,
      response_format: {
        type: "video",
        aspect_ratio: params.aspect_ratio || "9:16",
        duration: `${duration}s`,
        resolution: params.resolution || "720p",
      },
    }),
    // Video generation is synchronous and can take a few minutes
    signal: AbortSignal.timeout(280000),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    let errorMsg = `Gemini video API error (${response.status}): ${response.statusText}`;
    try {
      // Google sometimes wraps the error in an array: [{ "error": { ... } }]
      const parsed = JSON.parse(errorBody);
      const errorObj = Array.isArray(parsed) ? parsed[0]?.error : parsed.error;
      if (errorObj?.message) errorMsg = errorObj.message;
    } catch {
      if (errorBody) errorMsg += ` - ${errorBody.slice(0, 300)}`;
    }
    throw new GeminiVideoError(errorMsg, response.status);
  }

  const data = await response.json();
  const video = findVideoContent(data);
  const mimeType = video?.mime_type || video?.mimeType || "video/mp4";

  if (video?.data) {
    return { data: Buffer.from(video.data, "base64"), mimeType, model };
  }

  // URI delivery: download the file server-side so the API key never reaches the browser
  if (video?.uri) {
    const fileRes = await fetch(video.uri, {
      headers: { "x-goog-api-key": token },
      signal: AbortSignal.timeout(120000),
    });
    if (!fileRes.ok) {
      throw new GeminiVideoError(`Could not download the generated video (${fileRes.status}).`, 502);
    }
    return { data: Buffer.from(await fileRes.arrayBuffer()), mimeType, model };
  }

  throw new GeminiVideoError("No video generated in response", 502);
}
