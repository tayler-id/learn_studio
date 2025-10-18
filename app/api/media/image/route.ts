import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  if (!process.env.GEMINI_API_KEY) {
    return Response.json({ placeholder: true });
  }
  const { prompt } = await request.json();
  console.log("TODO: send prompt to Gemini image model", prompt);
  return Response.json({ placeholder: true });
}
