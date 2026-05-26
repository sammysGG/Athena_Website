"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { KIND_KEYS, KINDS, TOPICS, TOPIC_KEYS, kindLabel } from "@/lib/taxonomy";

type Article = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  body: string;
  kind: string;
  topic: string | null;
  source: string;
  heroImage: string | null;
  featured: boolean;
  pinned: boolean;
  status: string;
  publishedAt: string;
  scheduledFor: string | null;
};

const IMAGE_PRESETS = [
  { label: "— none —", value: "" },
  { label: "Spring Storm exercise", value: "/img/spring-storm.jpg" },
  { label: "Counter-drone", value: "/img/drone.png" },
  { label: "Government meeting", value: "/img/govmeeting.jpg" },
  { label: "Prime Minister", value: "/img/pm.jpg" },
  { label: "Press conference", value: "/img/presser.png" },
  { label: "NB8 / summit", value: "/img/nb8.png" },
  { label: "Economy", value: "/img/economy.jpg" },
];

const EMPTY = {
  title: "",
  summary: "",
  body: "",
  kind: "press-release",
  topic: "",
  source: "Government Communication Unit",
  heroImage: "",
  featured: false,
  pinned: false,
  status: "published",
  scheduledFor: "",
};

export default function AdminDashboard({ userName }: { userName: string }) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ ...EMPTY });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/articles?all=1", { cache: "no-store" });
    const data = await res.json();
    setArticles(data.articles ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function set<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function resetForm() {
    setForm({ ...EMPTY });
    setEditingId(null);
    setMsg(null);
  }

  function startEdit(a: Article) {
    setEditingId(a.id);
    setForm({
      title: a.title,
      summary: a.summary,
      body: a.body,
      kind: a.kind,
      topic: a.topic ?? "",
      source: a.source,
      heroImage: a.heroImage ?? "",
      featured: a.featured,
      pinned: a.pinned,
      status: a.status,
      scheduledFor: a.scheduledFor ? a.scheduledFor.slice(0, 16) : "",
    });
    setMsg(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const payload = {
      ...form,
      topic: form.topic || null,
      scheduledFor: form.scheduledFor ? new Date(form.scheduledFor).toISOString() : null,
    };
    const url = editingId ? `/api/articles/${editingId}` : "/api/articles";
    const method = editingId ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setBusy(false);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      setMsg(`Error: ${err.error ?? res.statusText}`);
      return;
    }
    setMsg(editingId ? "Article updated." : "Article published.");
    resetForm();
    load();
  }

  async function patch(id: string, data: Record<string, unknown>) {
    await fetch(`/api/articles/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this article? This cannot be undone.")) return;
    await fetch(`/api/articles/${id}`, { method: "DELETE" });
    if (editingId === id) resetForm();
    load();
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Newsroom</h1>
          <p className="text-sm text-muted">
            Signed in as {userName} ·{" "}
            <Link href="/" className="text-govblue hover:underline">
              View site
            </Link>
          </p>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="text-sm border border-line rounded-md px-3 py-1.5 hover:border-govblue"
        >
          Sign out
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* ---- Composer ---- */}
        <form onSubmit={submit} className="border border-line rounded-lg p-5 space-y-3 h-fit lg:sticky lg:top-40">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              {editingId ? "Edit article" : "Publish an article"}
            </h2>
            {editingId && (
              <button type="button" onClick={resetForm} className="text-sm text-govblue hover:underline">
                + New instead
              </button>
            )}
          </div>

          <label className="block text-sm font-medium">
            Title
            <input
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              required
              className="mt-1 w-full border border-line rounded-md px-3 py-2 outline-none focus:border-govblue font-normal"
            />
          </label>

          <label className="block text-sm font-medium">
            Summary (standfirst)
            <textarea
              value={form.summary}
              onChange={(e) => set("summary", e.target.value)}
              required
              rows={2}
              className="mt-1 w-full border border-line rounded-md px-3 py-2 outline-none focus:border-govblue font-normal"
            />
          </label>

          <label className="block text-sm font-medium">
            Body (paragraphs separated by a blank line; lines starting with “- ” become bullets)
            <textarea
              value={form.body}
              onChange={(e) => set("body", e.target.value)}
              required
              rows={9}
              className="mt-1 w-full border border-line rounded-md px-3 py-2 outline-none focus:border-govblue font-normal"
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block text-sm font-medium">
              Type
              <select
                value={form.kind}
                onChange={(e) => set("kind", e.target.value)}
                className="mt-1 w-full border border-line rounded-md px-2 py-2 outline-none focus:border-govblue font-normal"
              >
                {KIND_KEYS.map((k) => (
                  <option key={k} value={k}>
                    {KINDS[k]}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-medium">
              Topic
              <select
                value={form.topic}
                onChange={(e) => set("topic", e.target.value)}
                className="mt-1 w-full border border-line rounded-md px-2 py-2 outline-none focus:border-govblue font-normal"
              >
                <option value="">— none —</option>
                {TOPIC_KEYS.map((t) => (
                  <option key={t} value={t}>
                    {TOPICS[t].label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="block text-sm font-medium">
            Source / issuing body
            <input
              value={form.source}
              onChange={(e) => set("source", e.target.value)}
              className="mt-1 w-full border border-line rounded-md px-3 py-2 outline-none focus:border-govblue font-normal"
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block text-sm font-medium">
              Image
              <select
                value={IMAGE_PRESETS.some((p) => p.value === form.heroImage) ? form.heroImage : "__custom"}
                onChange={(e) => {
                  if (e.target.value !== "__custom") set("heroImage", e.target.value);
                }}
                className="mt-1 w-full border border-line rounded-md px-2 py-2 outline-none focus:border-govblue font-normal"
              >
                {IMAGE_PRESETS.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
                <option value="__custom">Custom URL…</option>
              </select>
            </label>
            <label className="block text-sm font-medium">
              Image URL
              <input
                value={form.heroImage}
                onChange={(e) => set("heroImage", e.target.value)}
                placeholder="/img/…"
                className="mt-1 w-full border border-line rounded-md px-3 py-2 outline-none focus:border-govblue font-normal"
              />
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} />
              Featured (homepage)
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.pinned} onChange={(e) => set("pinned", e.target.checked)} />
              Pinned (top)
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="block text-sm font-medium">
              Status
              <select
                value={form.status}
                onChange={(e) => set("status", e.target.value)}
                className="mt-1 w-full border border-line rounded-md px-2 py-2 outline-none focus:border-govblue font-normal"
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </label>
            <label className="block text-sm font-medium">
              Schedule for (optional)
              <input
                type="datetime-local"
                value={form.scheduledFor}
                onChange={(e) => set("scheduledFor", e.target.value)}
                className="mt-1 w-full border border-line rounded-md px-2 py-2 outline-none focus:border-govblue font-normal"
              />
            </label>
          </div>

          {msg && (
            <p className={`text-sm ${msg.startsWith("Error") ? "text-red-600" : "text-green-700"}`}>
              {msg}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full bg-govblue text-white py-2.5 rounded-md font-medium hover:bg-govblue-dark disabled:opacity-60"
          >
            {busy ? "Saving…" : editingId ? "Save changes" : "Publish"}
          </button>
        </form>

        {/* ---- Article list ---- */}
        <div>
          <h2 className="text-lg font-semibold mb-3">
            All articles {!loading && <span className="text-muted font-normal">({articles.length})</span>}
          </h2>
          {loading ? (
            <p className="text-muted">Loading…</p>
          ) : (
            <ul className="space-y-2">
              {articles.map((a) => {
                const scheduled = a.scheduledFor && new Date(a.scheduledFor) > new Date();
                return (
                  <li key={a.id} className="border border-line rounded-md p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2 text-xs mb-1">
                          <span className="uppercase tracking-wide text-muted">{kindLabel(a.kind)}</span>
                          {a.status === "draft" && (
                            <span className="text-amber-700 bg-amber-100 px-1.5 rounded">draft</span>
                          )}
                          {scheduled && (
                            <span className="text-blue-700 bg-blue-100 px-1.5 rounded">scheduled</span>
                          )}
                          {a.pinned && <span className="text-govblue">📌 pinned</span>}
                          {a.featured && <span className="text-govblue">★ featured</span>}
                        </div>
                        <Link
                          href={`/news/${a.slug}`}
                          className="font-medium leading-snug hover:text-govblue block truncate"
                        >
                          {a.title}
                        </Link>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-xs">
                      <button onClick={() => startEdit(a)} className="text-govblue hover:underline">
                        Edit
                      </button>
                      <button onClick={() => patch(a.id, { pinned: !a.pinned })} className="hover:underline">
                        {a.pinned ? "Unpin" : "Pin"}
                      </button>
                      <button onClick={() => patch(a.id, { featured: !a.featured })} className="hover:underline">
                        {a.featured ? "Unfeature" : "Feature"}
                      </button>
                      <button
                        onClick={() => patch(a.id, { status: a.status === "draft" ? "published" : "draft" })}
                        className="hover:underline"
                      >
                        {a.status === "draft" ? "Publish" : "Unpublish"}
                      </button>
                      <button onClick={() => remove(a.id)} className="text-red-600 hover:underline">
                        Delete
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
