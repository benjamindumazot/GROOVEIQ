import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { getServiceClient } from "@/lib/supabase";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `You are the in-app guide for GrooveIQ, an app that teaches the history and culture of electronic dance music — its scenes, artists, labels, technologies, and the web of influence connecting them all.

Answer questions the way a knowledgeable scene veteran would: vivid, specific, grounded in real history. Use the vocabulary of people who actually lived the culture. Keep answers to 2-4 short paragraphs — this is a mobile learning app, not an essay.

When source material is provided below, use it to ground your answer. Cite the source naturally in the text if relevant. Never invent facts — if you don't know, say so.`;

export async function POST(req: NextRequest) {
  const { question } = await req.json();

  if (!question || typeof question !== "string") {
    return NextResponse.json({ error: "Missing question." }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY not configured." }, { status: 500 });
  }

  // Embed the question and search the knowledge base
  let contextBlock = "";
  try {
    const embeddingRes = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: question,
    });
    const embedding = embeddingRes.data[0].embedding;

    const supabase = getServiceClient();
    const { data: chunks } = await supabase.rpc("match_knowledge", {
      query_embedding: embedding,
      match_count: 5,
      match_threshold: 0.4,
    });

    if (chunks && chunks.length > 0) {
      contextBlock =
        "\n\n--- SOURCE MATERIAL ---\n" +
        chunks
          .map(
            (c: any) =>
              `[${c.source_title}${c.source_url ? ` (${c.source_url})` : ""}]\n${c.body}`
          )
          .join("\n\n");
    }
  } catch {
    // Knowledge base search failed — answer without context
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
      messages: [
        {
          role: "user",
          content: question + contextBlock,
        },
      ],
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    return NextResponse.json({ error: `Anthropic API error: ${text}` }, { status: 502 });
  }

  const data = await res.json();
  const answer = data.content?.[0]?.text ?? "No answer returned.";

  return NextResponse.json({ answer });
}
