import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArticleBySlug } from "@/lib/articles";
import { getCurrentUser } from "@/lib/auth-helpers";
import { formatDateTime, isoDate } from "@/lib/format";
import { KindBadge, TopicBadge } from "@/app/components/news/Badges";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const found = await getArticleBySlug(slug);
  if (!found) return { title: "Not found" };
  return { title: found.article.title, description: found.article.summary };
}

// Render the plain-text body: blank-line-separated paragraphs, with "- " lines
// grouped into bullet lists.
function ArticleBody({ body }: { body: string }) {
  const blocks = body.split(/\n\s*\n/);
  return (
    <div className="article-body prose-gov text-ink">
      {blocks.map((block, i) => {
        const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
        const isList = lines.length > 0 && lines.every((l) => l.startsWith("- "));
        if (isList) {
          return (
            <ul key={i}>
              {lines.map((l, j) => (
                <li key={j}>{l.replace(/^-\s+/, "")}</li>
              ))}
            </ul>
          );
        }
        return <p key={i}>{block.replace(/\n/g, " ")}</p>;
      })}
    </div>
  );
}

export default async function ArticlePage({ params }: { params: Params }) {
  const { slug } = await params;
  const found = await getArticleBySlug(slug);
  if (!found) notFound();

  const { article, isPublic } = found;
  if (!isPublic) {
    // Drafts / scheduled items are visible only to signed-in admins (preview).
    const user = await getCurrentUser();
    if (user?.role !== "admin") notFound();
  }

  return (
    <article className="container py-10 max-w-3xl">
      <nav className="text-xs text-muted mb-3">
        <Link href="/" className="hover:underline">
          Home
        </Link>{" "}
        /{" "}
        <Link href="/news" className="hover:underline">
          News
        </Link>
      </nav>

      {!isPublic && (
        <div className="mb-4 text-sm bg-amber-50 border border-amber-300 text-amber-900 rounded-md px-3 py-2">
          Preview — this item is {article.status === "draft" ? "a draft" : "scheduled"} and is not
          yet visible to the public.
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2 mb-3">
        <TopicBadge topic={article.topic} />
        <KindBadge kind={article.kind} />
      </div>

      <h1 className="mb-3">{article.title}</h1>
      <p className="text-lg text-muted mb-4">{article.summary}</p>

      <div className="text-sm text-muted border-y border-line py-3 mb-6 flex flex-wrap gap-x-6 gap-y-1">
        <span>{article.source}</span>
        <time dateTime={isoDate(article.publishedAt)}>{formatDateTime(article.publishedAt)}</time>
      </div>

      {article.heroImage && (
        <Image
          src={article.heroImage}
          alt=""
          width={900}
          height={500}
          priority
          className="w-full rounded-lg object-cover mb-3 bg-soft"
        />
      )}

      <ArticleBody body={article.body} />

      <div className="mt-10 pt-6 border-t border-line">
        <Link href="/news" className="text-govblue font-medium hover:underline">
          ← Back to all news
        </Link>
      </div>
    </article>
  );
}
