import Link from "next/link";
import Image from "next/image";
import type { Article } from "@prisma/client";
import { formatDate, isoDate } from "@/lib/format";
import { KindBadge, TopicBadge } from "./Badges";

// Horizontal list row used on the news listing page.
export function ArticleRow({ article }: { article: Article }) {
  return (
    <article className="gov-card flex gap-4 py-5 border-b border-line">
      {article.heroImage && (
        <Link href={`/news/${article.slug}`} className="shrink-0 hidden sm:block">
          <Image
            src={article.heroImage}
            alt=""
            width={180}
            height={120}
            className="w-[180px] h-[120px] object-cover rounded-md bg-soft"
          />
        </Link>
      )}
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <TopicBadge topic={article.topic} />
          <KindBadge kind={article.kind} />
          <time dateTime={isoDate(article.publishedAt)} className="text-xs text-muted">
            {formatDate(article.publishedAt)}
          </time>
        </div>
        <h3 className="text-lg md:text-xl font-semibold leading-snug">
          <Link href={`/news/${article.slug}`} className="hover:text-govblue">
            {article.title}
          </Link>
        </h3>
        <p className="text-sm text-muted mt-1 line-clamp-2">{article.summary}</p>
        <div className="text-xs text-muted mt-2">{article.source}</div>
      </div>
    </article>
  );
}

// Compact card used in grids (homepage secondary list).
export function ArticleCardSmall({ article }: { article: Article }) {
  return (
    <article className="gov-card flex flex-col">
      {article.heroImage ? (
        <Link href={`/news/${article.slug}`}>
          <Image
            src={article.heroImage}
            alt=""
            width={400}
            height={220}
            className="w-full h-44 object-cover rounded-md bg-soft"
          />
        </Link>
      ) : (
        <div className="w-full h-2 rounded-md bg-govblue/80" />
      )}
      <div className="flex items-center gap-2 mt-3 mb-1">
        <TopicBadge topic={article.topic} />
        <time dateTime={isoDate(article.publishedAt)} className="text-xs text-muted">
          {formatDate(article.publishedAt)}
        </time>
      </div>
      <h3 className="text-base font-semibold leading-snug">
        <Link href={`/news/${article.slug}`} className="hover:text-govblue">
          {article.title}
        </Link>
      </h3>
    </article>
  );
}
