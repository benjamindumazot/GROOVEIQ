"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { getBrowserClient } from "@/lib/supabase-browser";
import type { User } from "@supabase/supabase-js";

export default function NavAuth({ user }: { user: User | null }) {
  const router = useRouter();

  async function signOut() {
    const supabase = getBrowserClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className="shrink-0 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-1.5 transition-all"
      >
        Sign in
      </Link>
    );
  }

  const name = user.user_metadata?.display_name ?? user.email?.split("@")[0] ?? "You";

  return (
    <div className="flex items-center gap-3 shrink-0">
      <span className="text-xs text-zinc-500 hidden sm:block">{name}</span>
      <button
        onClick={signOut}
        className="rounded-full border border-zinc-800 text-zinc-500 hover:text-white hover:border-zinc-600 text-xs font-medium px-3 py-1.5 transition-all"
      >
        Sign out
      </button>
    </div>
  );
}
