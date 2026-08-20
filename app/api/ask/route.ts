import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are the in-app guide for GrooveIQ, an app that teaches the history and culture of electronic dance music (NY Garage, Chicago House, Detroit Techno, Berlin Techno, and beyond).

Answer questions the way a knowledgeable scene veteran would: vivid, specific, grounded in real history (artists, labels, venues, gear, dates), never vague or generic. Use the vocabulary of people who actually lived the culture. Keep answers to 2-4 short paragraphs — this is a mobile learning app, not an essay.`;

export async function POST(req: NextRequest) {
  const { question } = await req.json();

  if (!question || typeof question !== "string") {
    return NextResponse.json({ error: "Missing question." }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY is not configured." },
      { status: 500 }
    );
  }

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 600,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: question }],
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    return NextResponse.json(
      { error: `Anthropic API error: ${text}` },
      { status: 502 }
    );
  }

  const data = await res.json();
  const answer = data.content?.[0]?.text ?? "No answer returned.";

  return NextResponse.json({ answer });
}
