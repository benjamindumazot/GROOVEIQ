import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const adminKey = req.headers.get("x-admin-key");
  if (adminKey !== process.env.ADMIN_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getServiceClient();

  const { data, error } = await supabase
    .from("knowledge_chunks")
    .select("source_title, source_url, source_type, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Group by source, count chunks
  const sources: Record<string, { source_title: string; source_url: string | null; source_type: string; chunks: number; created_at: string }> = {};
  for (const row of data ?? []) {
    const key = row.source_title;
    if (!sources[key]) {
      sources[key] = {
        source_title: row.source_title,
        source_url: row.source_url,
        source_type: row.source_type,
        chunks: 0,
        created_at: row.created_at,
      };
    }
    sources[key].chunks++;
  }

  return NextResponse.json({ sources: Object.values(sources) });
}
