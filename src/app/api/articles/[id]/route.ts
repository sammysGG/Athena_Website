import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, errorResponse, HttpError } from "@/lib/auth-helpers";
import { KIND_KEYS, TOPIC_KEYS } from "@/lib/taxonomy";

type Ctx = { params: Promise<{ id: string }> };

// PATCH /api/articles/:id  (admin) — edit fields or toggle pinned/featured/status
export async function PATCH(req: Request, { params }: Ctx) {
  try {
    await requireAdmin();
    const { id } = await params;
    const existing = await prisma.article.findUnique({ where: { id } });
    if (!existing) throw new HttpError(404, "Article not found");

    const body = (await req.json()) as Record<string, unknown>;
    const data: Record<string, unknown> = {};

    if (body.title !== undefined) data.title = String(body.title).trim();
    if (body.summary !== undefined) data.summary = String(body.summary).trim();
    if (body.body !== undefined) data.body = String(body.body).trim();
    if (body.source !== undefined) data.source = String(body.source).trim();
    if (body.heroImage !== undefined)
      data.heroImage = body.heroImage ? String(body.heroImage).trim() : null;
    if (body.kind !== undefined) {
      if (!KIND_KEYS.includes(String(body.kind))) throw new HttpError(400, "Invalid kind");
      data.kind = String(body.kind);
    }
    if (body.topic !== undefined) {
      const t = body.topic ? String(body.topic) : null;
      if (t && !TOPIC_KEYS.includes(t)) throw new HttpError(400, "Invalid topic");
      data.topic = t;
    }
    if (body.featured !== undefined) data.featured = Boolean(body.featured);
    if (body.pinned !== undefined) data.pinned = Boolean(body.pinned);
    if (body.status !== undefined)
      data.status = body.status === "draft" ? "draft" : "published";
    if (body.scheduledFor !== undefined)
      data.scheduledFor = body.scheduledFor ? new Date(String(body.scheduledFor)) : null;

    const article = await prisma.article.update({ where: { id }, data });
    return NextResponse.json({ article });
  } catch (err) {
    return errorResponse(err);
  }
}

// DELETE /api/articles/:id  (admin)
export async function DELETE(_req: Request, { params }: Ctx) {
  try {
    await requireAdmin();
    const { id } = await params;
    await prisma.article.delete({ where: { id } }).catch(() => {
      throw new HttpError(404, "Article not found");
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return errorResponse(err);
  }
}
