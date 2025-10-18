import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  if (!process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_FEATURE_VEO !== "1") {
    return Response.json({ placeholder: true });
  }
  const { text } = await request.json();
  console.log("TODO: send text to Veo via Gemini", text);
  return Response.json({ placeholder: true });
}
