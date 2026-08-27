"use client";

import { useState, useEffect, useCallback } from "react";

type Source = {
  source_title: string;
  source_url: string | null;
  source_type: string;
  chunks: number;
  created_at: string;
};

export default function IngestPage() {
  const [adminKey, setAdminKey] = useState("");
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [sourceType, setSourceType] = useState("article");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sources, setSources] = useState<Source[]>([]);
  const [logError, setLogError] = useState<string | null>(null);

  const fetchLog = useCallback(async (key: string) => {
    if (!key) return;
    const res = await fetch("/api/ingest-log", {
      headers: { "x-admin-key": key },
    });
    if (res.ok) {
      const data = await res.json();
      setSources(data.sources ?? []);
      setLogError(null);
    } else {
      setLogError("Could not load log.");
    }
  }, []);

  useEffect(() => {
    if (adminKey.length > 5) fetchLog(adminKey);
  }, [adminKey, fetchLog]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!adminKey) return setStatus("Admin key required.");
    if (!url && !text) return setStatus("Provide a URL or raw text.");

    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch("/api/ingest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey,
        },
        body: JSON.stringify({
          url: url || undefined,
          text: text || undefined,
          title: title || undefined,
          source_type: sourceType,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setStatus(`Error: ${data.error}`);
      } else {
        setStatus(`Done — ${data.chunks_inserted} chunks indexed from "${data.source}".`);
        setUrl("");
        setText("");
        setTitle("");
        fetchLog(adminKey);
      }
    } catch (err: any) {
      setStatus(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  const typeColors: Record<string, string> = {
    article: "#6366f1",
    book: "#f59e0b",
    interview: "#10b981",
    podcast: "#ec4899",
    website: "#3b82f6",
    raw_text: "#71717a",
  };

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "48px 24px" }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
        Knowledge Base Ingestion
      </h1>
      <p style={{ color: "#a1a1aa", marginBottom: 32, fontSize: 14 }}>
        Feed source material into GrooveIQ's knowledge base. Paste a URL or raw text — it'll be chunked, embedded, and indexed for the Ask feature.
      </p>

      <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div>
          <label style={labelStyle}>Admin Key</label>
          <input
            type="password"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            placeholder="Enter admin key"
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>Source URL <span style={{ color: "#71717a" }}>(optional if pasting text below)</span></label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://..."
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>Raw Text <span style={{ color: "#71717a" }}>(optional if URL provided)</span></label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste article, book excerpt, interview transcript..."
            rows={8}
            style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }}
          />
        </div>

        <div style={{ display: "flex", gap: 16 }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Title <span style={{ color: "#71717a" }}>(optional)</span></label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Source title"
              style={inputStyle}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Source Type</label>
            <select
              value={sourceType}
              onChange={(e) => setSourceType(e.target.value)}
              style={inputStyle}
            >
              <option value="article">Article</option>
              <option value="book">Book</option>
              <option value="interview">Interview</option>
              <option value="podcast">Podcast</option>
              <option value="website">Website</option>
              <option value="raw_text">Raw Text</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            background: loading ? "#3f3f46" : "#6366f1",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "12px 24px",
            fontSize: 15,
            fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer",
            transition: "background 0.15s",
          }}
        >
          {loading ? "Indexing…" : "Ingest"}
        </button>

        {status && (
          <div
            style={{
              padding: "12px 16px",
              borderRadius: 8,
              background: status.startsWith("Error") ? "#3f1515" : "#14532d",
              color: status.startsWith("Error") ? "#fca5a5" : "#86efac",
              fontSize: 14,
            }}
          >
            {status}
          </div>
        )}
      </form>

      {/* Knowledge Base Log */}
      <div style={{ marginTop: 48 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>
          Knowledge Base
        </h2>
        <p style={{ color: "#71717a", fontSize: 13, marginBottom: 20 }}>
          {sources.length} source{sources.length !== 1 ? "s" : ""} indexed
          {sources.length > 0 && ` · ${sources.reduce((n, s) => n + s.chunks, 0)} total chunks`}
        </p>

        {logError && <p style={{ color: "#fca5a5", fontSize: 13 }}>{logError}</p>}

        {sources.length === 0 && !logError && adminKey.length > 5 && (
          <p style={{ color: "#52525b", fontSize: 13 }}>No sources ingested yet.</p>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {sources.map((s, i) => (
            <div
              key={i}
              style={{
                background: "#18181b",
                border: "1px solid #27272a",
                borderRadius: 8,
                padding: "12px 16px",
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  padding: "2px 8px",
                  borderRadius: 4,
                  background: typeColors[s.source_type] ?? "#52525b",
                  color: "#fff",
                  flexShrink: 0,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                {s.source_type}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#e4e4e7", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {s.source_title}
                </div>
                {s.source_url && (
                  <div style={{ fontSize: 12, color: "#71717a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {s.source_url}
                  </div>
                )}
              </div>
              <span style={{ fontSize: 12, color: "#52525b", flexShrink: 0 }}>
                {s.chunks} chunk{s.chunks !== 1 ? "s" : ""}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 13,
  fontWeight: 600,
  marginBottom: 6,
  color: "#e4e4e7",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "#18181b",
  border: "1px solid #3f3f46",
  borderRadius: 8,
  padding: "10px 12px",
  color: "#e4e4e7",
  fontSize: 14,
  outline: "none",
  boxSizing: "border-box",
};
