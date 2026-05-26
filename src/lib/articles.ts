import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

// An article is publicly visible when it is published and its publish time has
// passed (and any scheduled-for embargo has lifted).
export function publicArticleWhere(extra?: Prisma.ArticleWhereInput): Prisma.ArticleWhereInput {
  const now = new Date();
  return {
    status: "published",
    publishedAt: { lte: now },
    OR: [{ scheduledFor: null }, { scheduledFor: { lte: now } }],
    ...extra,
  };
}

export async function getPublicArticles(opts?: { topic?: string; take?: number; skip?: number }) {
  const where = publicArticleWhere(opts?.topic ? { topic: opts.topic } : undefined);
  return prisma.article.findMany({
    where,
    orderBy: [{ pinned: "desc" }, { publishedAt: "desc" }],
    take: opts?.take,
    skip: opts?.skip,
  });
}

export async function getFeaturedArticles(take = 3) {
  return prisma.article.findMany({
    where: publicArticleWhere({ featured: true }),
    orderBy: [{ pinned: "desc" }, { publishedAt: "desc" }],
    take,
  });
}

export async function getArticleBySlug(slug: string) {
  const article = await prisma.article.findUnique({ where: { slug } });
  if (!article) return null;
  // Withhold non-public articles from anonymous viewers.
  const now = new Date();
  const isPublic =
    article.status === "published" &&
    article.publishedAt <= now &&
    (!article.scheduledFor || article.scheduledFor <= now);
  return { article, isPublic };
}
