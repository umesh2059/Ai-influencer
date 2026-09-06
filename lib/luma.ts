/**
 * Luma Agents API Client Helper
 * Supports Luma Uni-1 (image) and Ray-3.2 (video) models.
 * Base URL: https://agents.lumalabs.ai/v1
 */

const LUMA_BASE_URL = "https://agents.lumalabs.ai/v1";

export interface LumaGenerationRequest {
  prompt: string;
  aspect_ratio?: "1:1" | "16:9" | "9:16" | "4:3" | "3:4" | "21:9";
  model?: "uni-1" | "uni-1-max" | "ray-3.2";
  type?: "image" | "video" | "image_edit" | "video_edit";
  video?: {
    resolution?: "540p" | "720p" | "1080p" | "4k";
    duration?: "5s" | "9s";
    start_frame?: { url: string };
    end_frame?: { url: string };
  };
  user_id?: string;
}

export interface LumaGenerationResponse {
  id: string;
  state: "queued" | "dreaming" | "pending" | "completed" | "failed";
  failure_reason?: string | null;
  failure_code?: string | null;
  output?: Array<{ url: string }> | null;
  created_at?: string;
  model?: string;
  type?: string;
}

/**
 * Submit generation request to Luma Agents API
 */
export async function submitLumaGeneration(
  params: LumaGenerationRequest,
  apiKey?: string
): Promise<LumaGenerationResponse> {
  const token = apiKey || process.env.LUMA_AGENTS_API_KEY;

  if (!token) {
    throw new Error("LUMA_AGENTS_API_KEY is not configured.");
  }

  const payload: Record<string, any> = {
    prompt: params.prompt,
    aspect_ratio: params.aspect_ratio || "1:1",
  };

  if (params.model) {
    payload.model = params.model;
  }

  if (params.type) {
    payload.type = params.type;
  }

  if (params.video) {
    payload.video = params.video;
  }

  if (params.user_id) {
    payload.user_id = params.user_id;
  }

  const response = await fetch(`${LUMA_BASE_URL}/generations`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    let errorMsg = `Luma API error (${response.status}): ${response.statusText}`;
    try {
      const parsed = JSON.parse(errorBody);
      if (parsed.message) errorMsg = parsed.message;
      else if (parsed.detail) errorMsg = parsed.detail;
    } catch {
      if (errorBody) errorMsg += ` - ${errorBody}`;
    }
    throw new Error(errorMsg);
  }

  return response.json();
}

/**
 * Poll generation status by ID
 */
export async function getLumaGenerationStatus(
  generationId: string,
  apiKey?: string
): Promise<LumaGenerationResponse> {
  const token = apiKey || process.env.LUMA_AGENTS_API_KEY;

  if (!token) {
    throw new Error("LUMA_AGENTS_API_KEY is not configured.");
  }

  const response = await fetch(`${LUMA_BASE_URL}/generations/${generationId}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Failed to fetch generation status (${response.status}): ${errorBody}`);
  }

  return response.json();
}
