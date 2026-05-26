import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { publicArticleWhere } from "@/lib/articles";
import { TOPICS } from "@/lib/taxonomy";
import { ArticleRow } from "@/app/components/news/ArticleCard";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "News" };

type SearchParams = Promise<{ topic?: string; q?: string }>;

export default async function NewsPage({ searchParams }: { searchParams: SearchParams }) {
  const { topic, q } = await searchParams;
  const query = (q ?? "").trim();

  const where = publicArticleWhere({
    ...(topic && TOPICS[topic] ? { topic } : {}),
    ...(query
      ? {
          OR: [
            { title: { contains: query } },
            { summary: { contains: query } },
            { body: { contains: query } },
          ],
        }
      : {}),
  });

  const articles = await prisma.article.findMany({
    where,
    orderBy: [{ pinned: "desc" }, { publishedAt: "desc" }],
    take: 100,
  });

  const baseFor = (t?: string) => {
    const params = new URLSearchParams();
    if (t) params.set("topic", t);
    if (query) params.set("q", query);
    const s = params.toString();
    return s ? `/news?${s}` : "/news";
  };

  return (
    <div className="container py-10">
      <nav className="text-xs text-muted mb-2">
        <Link href="/" className="hover:underline">
          Home
        </Link>{" "}
        / News
      </nav>
      <h1 className="mb-6">News and announcements</h1>

      {/* Topic filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Link
          href={baseFor()}
          className={`text-sm px-3 py-1.5 rounded-full border ${
            !topic
              ? "bg-govblue text-white border-govblue"
              : "border-line text-ink hover:border-govblue"
          }`}
        >
          All topics
        </Link>
        {Object.entries(TOPICS).map(([key, meta]) => (
          <Link
            key={key}
            href={baseFor(key)}
            className={`text-sm px-3 py-1.5 rounded-full border ${
              topic === key
                ? "bg-govblue text-white border-govblue"
                : "border-line text-ink hover:border-govblue"
            }`}
          >
            {meta.label}
          </Link>
        ))}
      </div>

      {query && (
        <p className="text-sm text-muted mb-4">
          {articles.length} result{articles.length === 1 ? "" : "s"} for “{query}”.{" "}
          <Link href={topic ? `/news?topic=${topic}` : "/news"} className="text-govblue hover:underline">
            Clear search
          </Link>
        </p>
      )}

      {articles.length === 0 ? (
        <p className="text-muted py-12">No articles match this filter.</p>
      ) : (
        <div className="border-t border-line">
          {articles.map((a) => (
            <ArticleRow key={a.id} article={a} />
          ))}
        </div>
      )}
    </div>
  );
}
