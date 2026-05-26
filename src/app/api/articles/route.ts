import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, requireAdmin, errorResponse, HttpError } from "@/lib/auth-helpers";
import { publicArticleWhere } from "@/lib/articles";
import { slugify } from "@/lib/slug";
import { KIND_KEYS, TOPIC_KEYS } from "@/lib/taxonomy";

// GET /api/articles
//   - anonymous / non-admin: published, public articles only
//   - admin (?all=1): every article incl. drafts & scheduled (for the dashboard)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const wantAll = searchParams.get("all") === "1";
    const topic = searchParams.get("topic") || undefined;

    const user = await getCurrentUser();
    const isAdmin = user?.role === "admin";

    const where =
      wantAll && isAdmin
        ? topic
          ? { topic }
          : {}
        : publicArticleWhere(topic ? { topic } : undefined);

    const articles = await prisma.article.findMany({
      where,
      orderBy: [{ pinned: "desc" }, { publishedAt: "desc" }],
      take: 100,
    });
    return NextResponse.json({ articles });
  } catch (err) {
    return errorResponse(err);
  }
}

// POST /api/articles  (admin) — create / publish an article
export async function POST(req: Request) {
  try {
    const admin = await requireAdmin();
    const body = (await req.json()) as Record<string, unknown>;

    const title = String(body.title ?? "").trim();
    const summary = String(body.summary ?? "").trim();
    const articleBody = String(body.body ?? "").trim();
    if (!title || !summary || !articleBody) {
      throw new HttpError(400, "Title, summary and body are required");
    }

    const kind = String(body.kind ?? "press-release");
    if (!KIND_KEYS.includes(kind)) throw new HttpError(400, "Invalid kind");

    const topic = body.topic ? String(body.topic) : null;
    if (topic && !TOPIC_KEYS.includes(topic)) throw new HttpError(400, "Invalid topic");

    // unique slug
    const base = body.slug ? slugify(String(body.slug)) : slugify(title);
    let slug = base || `article-${Date.now()}`;
    for (let i = 2; await prisma.article.findUnique({ where: { slug } }); i++) {
      slug = `${base}-${i}`;
    }

    const scheduledFor = body.scheduledFor ? new Date(String(body.scheduledFor)) : null;
    const status = body.status === "draft" ? "draft" : "published";
    // If scheduled in the future, treat publishedAt as that moment too.
    const publishedAt =
      scheduledFor && scheduledFor > new Date() ? scheduledFor : new Date();

    const article = await prisma.article.create({
      data: {
        slug,
        title,
        summary,
        body: articleBody,
        kind,
        topic,
        source: String(body.source ?? "Government Communication Unit").trim() || "Government Communication Unit",
        heroImage: body.heroImage ? String(body.heroImage).trim() : null,
        featured: Boolean(body.featured),
        pinned: Boolean(body.pinned),
        status,
        scheduledFor,
        publishedAt,
        authorId: admin.id,
      },
    });
    return NextResponse.json({ article }, { status: 201 });
  } catch (err) {
    return errorResponse(err);
  }
}
