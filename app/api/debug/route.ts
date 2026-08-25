import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";

export async function GET() {
  const supabase = getServiceClient();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const { data, error } = await supabase.from("scenes").select("slug, name");

  return NextResponse.json({
    url_set: !!url,
    key_set: !!key,
    url_prefix: url?.slice(0, 30),
    scenes: data,
    error: error?.message ?? null,
  });
}
