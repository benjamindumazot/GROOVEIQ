"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getBrowserClient } from "@/lib/supabase-browser";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const supabase = getBrowserClient();

    if (mode === "signup") {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { display_name: username } },
      });
      if (signUpError) { setError(signUpError.message); setLoading(false); return; }
      setCheckEmail(true);
      setLoading(false);
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) { setError(signInError.message); setLoading(false); return; }
    router.push("/play");
    router.refresh();
  }

  if (checkEmail) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-sm w-full text-center">
          <div className="text-4xl mb-4">📬</div>
          <h1 className="text-2xl font-black mb-2">Check your email</h1>
          <p className="text-zinc-400 text-sm">We sent a confirmation link to <span className="text-white">{email}</span>. Click it to activate your account.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-sm w-full">
        <div className="mb-8 text-center">
          <p className="text-xs font-mono tracking-[0.3em] text-indigo-400 uppercase mb-3">
            {mode === "login" ? "Welcome back" : "Join GrooveIQ"}
          </p>
          <h1 className="text-3xl font-black tracking-tight">
            {mode === "login" ? "Sign in" : "Create account"}
          </h1>
          <p className="text-zinc-500 mt-2 text-sm">
            {mode === "login"
              ? "Pick up where you left off."
              : "Start your journey through dance music history."}
          </p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          {mode === "signup" && (
            <div>
              <label className="block text-xs font-mono text-zinc-500 uppercase tracking-wider mb-1.5">Username</label>
              <input
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="your handle"
                required
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          )}
          <div>
            <label className="block text-xs font-mono text-zinc-500 uppercase tracking-wider mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-zinc-500 uppercase tracking-wider mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {error && (
            <p className="text-sm text-red-400 bg-red-950/30 border border-red-900 rounded-lg px-4 py-3">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white font-bold py-3 transition-all text-sm"
          >
            {loading ? "…" : mode === "login" ? "Sign in" : "Create account"}
          </button>
        </form>

        <p className="text-center text-sm text-zinc-600 mt-6">
          {mode === "login" ? "No account?" : "Already have one?"}{" "}
          <button
            onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }}
            className="text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            {mode === "login" ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}
