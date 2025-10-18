import type { MediaAsset } from "./types";

const IMAGE_PLACEHOLDER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 225" fill="none">
      <rect width="400" height="225" rx="24" fill="#F1F5F9" />
      <path d="M84 156h232" stroke="#CBD5F5" stroke-width="6" stroke-linecap="round" />
      <path d="M112 128h176" stroke="#CBD5F5" stroke-width="6" stroke-linecap="round" />
      <path d="M152 100h96" stroke="#CBD5F5" stroke-width="6" stroke-linecap="round" />
      <circle cx="200" cy="76" r="22" stroke="#CBD5F5" stroke-width="6" />
      <text x="200" y="190" text-anchor="middle" font-size="20" fill="#64748B" font-family="'Inter', sans-serif">Media placeholder</text>
    </svg>`
  );

function placeholderImage(): MediaAsset {
  return {
    id: crypto.randomUUID(),
    type: "image",
    src: IMAGE_PLACEHOLDER,
    alt: "Placeholder illustration",
    provider: "nanobanana",
    synthID: false,
    placeholder: true,
  };
}

function placeholderVideo(): MediaAsset {
  return {
    id: crypto.randomUUID(),
    type: "video",
    src: "",
    provider: "veo",
    placeholder: true,
  };
}

export async function generateImage(prompt: string, referenceDataUrl?: string): Promise<MediaAsset> {
  try {
    const response = await fetch("/api/media/image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, reference: referenceDataUrl }),
    });

    if (!response.ok) {
      throw new Error(`Image generation failed with status ${response.status}`);
    }

    const json = await response.json();
    const isPlaceholder = Boolean(json.placeholder);
    const src: string | undefined = isPlaceholder
      ? undefined
      : json.filePath ?? json.url ?? undefined;

    if (!src) {
      return placeholderImage();
    }

    return {
      id: crypto.randomUUID(),
      type: "image",
      src,
      alt: json.alt ?? "",
      provider: (json.provider as MediaAsset["provider"]) ?? "nanobanana",
      synthID: Boolean(json.synthID ?? true),
    };
  } catch (error) {
    console.error("Falling back to placeholder image", error);
    return placeholderImage();
  }
}

export async function generateVideo(script: string, firstImageDataUrl?: string): Promise<MediaAsset> {
  try {
    const response = await fetch("/api/media/video", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: script, firstImage: firstImageDataUrl?.split(",")[1], aspect: "16:9" }),
    });

    if (!response.ok) {
      throw new Error(`Video generation failed with status ${response.status}`);
    }

    const json = await response.json();
    const isPlaceholder = Boolean(json.placeholder);
    const src: string | undefined = isPlaceholder
      ? undefined
      : json.filePath ?? json.url ?? undefined;

    if (!src) {
      return placeholderVideo();
    }

    return {
      id: crypto.randomUUID(),
      type: "video",
      src,
      provider: (json.provider as MediaAsset["provider"]) ?? "veo",
    };
  } catch (error) {
    console.error("Falling back to placeholder video", error);
    return placeholderVideo();
  }
}
