import { NextRequest, NextResponse } from "next/server";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import OpenAI from "openai";
import { getServiceClient } from "@/lib/supabase";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 500,
  chunkOverlap: 50,
});

async function extractFromUrl(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: { "User-Agent": "GrooveIQ-Bot/1.0" },
  });
  const html = await res.text();
  // Strip HTML tags, collapse whitespace
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 100000); // cap at 100k chars
}

export async function POST(req: NextRequest) {
  const adminKey = req.headers.get("x-admin-key");
  if (adminKey !== process.env.ADMIN_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { url, text, title, source_type = "article" } = await req.json();

  if (!url && !text) {
    return NextResponse.json({ error: "Provide url or text." }, { status: 400 });
  }

  const raw = text ?? (await extractFromUrl(url));
  const chunks = await splitter.splitText(raw);
  const sourceTitle = title ?? url ?? "Untitled";

  const supabase = getServiceClient();

  let inserted = 0;
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    if (chunk.trim().length < 50) continue;

    const embeddingRes = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: chunk,
    });
    const embedding = embeddingRes.data[0].embedding;

    const { error } = await supabase.from("knowledge_chunks").insert({
      source_url: url ?? null,
      source_title: sourceTitle,
      source_type,
      body: chunk,
      embedding,
      chunk_index: i,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    inserted++;
  }

  return NextResponse.json({
    ok: true,
    chunks_inserted: inserted,
    source: sourceTitle,
  });
}
