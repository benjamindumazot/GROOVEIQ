"use client";

import { useState } from "react";

export default function IngestPage() {
  const [adminKey, setAdminKey] = useState("");
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [sourceType, setSourceType] = useState("article");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
      }
    } catch (err: any) {
      setStatus(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: "48px 24px" }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
        Knowledge Base Ingestion
      </h1>
      <p style={{ color: "#a1a1aa", marginBottom: 32, fontSize: 14 }}>
        Feed source material into GrooveIQ's knowledge base. Paste a URL or raw text — it'll be chunked, embedded, and indexed for the Ask feature.
      </p>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
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
            type="url"
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
