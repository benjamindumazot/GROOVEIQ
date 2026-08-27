import { NextRequest, NextResponse } from "next/server";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import OpenAI from "openai";
import { getServiceClient } from "@/lib/supabase";

export const maxDuration = 60;

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
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 60000); // tighter cap to stay within time budget
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
  const allChunks = await splitter.splitText(raw);
  const chunks = allChunks.filter((c) => c.trim().length >= 50);
  const sourceTitle = title ?? url ?? "Untitled";

  // Batch all embeddings in one API call (much faster)
  const embeddingRes = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: chunks,
  });

  const supabase = getServiceClient();

  const rows = chunks.map((chunk, i) => ({
    source_url: url ?? null,
    source_title: sourceTitle,
    source_type,
    body: chunk,
    embedding: embeddingRes.data[i].embedding,
    chunk_index: i,
  }));

  const { error } = await supabase.from("knowledge_chunks").insert(rows);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    chunks_inserted: rows.length,
    source: sourceTitle,
  });
}
