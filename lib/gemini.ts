/**
 * Google Gemini API Client Helper
 * Supports Gemini image generation models.
 * Base URL: https://generativelanguage.googleapis.com/v1beta
 */

const GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta";

export interface GeminiGenerationRequest {
  prompt: string;
  aspect_ratio?: "1:1" | "16:9" | "9:16" | "4:3" | "3:4";
  model?: string;
  user_id?: string;
}

export interface GeminiGenerationResponse {
  id: string;
  state: "queued" | "processing" | "completed" | "failed";
  failure_reason?: string | null;
  output?: Array<{ url: string }> | null;
  created_at?: string;
  model?: string;
  type?: string;
}

export interface GeminiImageResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        // The REST API responds in camelCase; snake_case kept for compatibility
        inlineData?: {
          mimeType: string;
          data: string;
        };
        inline_data?: {
          mime_type: string;
          data: string;
        };
        text?: string;
      }>;
    };
  }>;
}

export async function submitGeminiGeneration(
  params: GeminiGenerationRequest,
  apiKey?: string
): Promise<GeminiGenerationResponse> {
  const token = apiKey || process.env.GEMINI_API_KEY;

  if (!token) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  const model = params.model || "gemini-2.5-flash-image";

  const payload = {
    contents: [
      {
        role: "user",
        parts: [
          {
            text: params.prompt,
          },
        ],
      },
    ],
    generationConfig: {
      response_modalities: ["IMAGE", "TEXT"],
    },
  };

  const response = await fetch(
    `${GEMINI_BASE_URL}/models/${model}:generateContent?key=${token}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    const errorBody = await response.text();
    let errorMsg = `Gemini API error (${response.status}): ${response.statusText}`;
    try {
      const parsed = JSON.parse(errorBody);
      if (parsed.error?.message) errorMsg = parsed.error.message;
    } catch {
      if (errorBody) errorMsg += ` - ${errorBody}`;
    }
    throw new Error(errorMsg);
  }

  const data: GeminiImageResponse = await response.json();

  const imagePart = data.candidates?.[0]?.content?.parts?.find(
    (part) => part.inlineData?.data || part.inline_data?.data
  );
  const imageBase64 = imagePart?.inlineData?.data || imagePart?.inline_data?.data;
  const imageMimeType = imagePart?.inlineData?.mimeType || imagePart?.inline_data?.mime_type || "image/png";

  if (!imageBase64) {
    throw new Error("No image generated in response");
  }

  const generationId = `gemini-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;

  return {
    id: generationId,
    state: "completed",
    output: [
      {
        url: `data:${imageMimeType};base64,${imageBase64}`,
      },
    ],
    model,
    type: "image",
    created_at: new Date().toISOString(),
  };
}

export async function getGeminiGenerationStatus(
  generationId: string,
  apiKey?: string
): Promise<GeminiGenerationResponse> {
  return {
    id: generationId,
    state: "completed",
    output: null,
    model: "gemini-2.0-flash-preview-image-generation",
    type: "image",
    created_at: new Date().toISOString(),
  };
}