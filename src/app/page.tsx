import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { getFeaturedArticles, getPublicArticles } from "@/lib/articles";
import { formatDate, isoDate } from "@/lib/format";
import { ArticleRow } from "@/app/components/news/ArticleCard";
import { KindBadge, TopicBadge } from "@/app/components/news/Badges";

export const dynamic = "force-dynamic";

const QUICK_LINKS = [
  { label: "Crisis information", href: "https://www.kriis.ee/en", note: "kriis.ee" },
  { label: "President of the Republic", href: "https://www.president.ee/en", note: "president.ee" },
  { label: "Riigikogu", href: "https://www.riigikogu.ee/en", note: "Parliament" },
  { label: "State Gazette", href: "https://www.riigiteataja.ee/en", note: "Riigi Teataja" },
  { label: "State services", href: "https://www.eesti.ee/en", note: "eesti.ee" },
  { label: "Estonia 2035", href: "/estonia-2035", note: "Strategy" },
];

export default async function HomePage() {
  const [featured, latest, pm] = await Promise.all([
    getFeaturedArticles(3),
    getPublicArticles({ take: 6 }),
    prisma.minister.findFirst({ where: { title: "Prime Minister" } }),
  ]);

  const lead = featured[0];
  const sideFeatured = featured.slice(1, 3);

  return (
    <div>
      {/* ---- Hero ---- */}
      {lead && (
        <section className="bg-soft border-b border-line">
          <div className="container py-8 grid gap-6 lg:grid-cols-3">
            <Link
              href={`/news/${lead.slug}`}
              className="lg:col-span-2 group block bg-white rounded-lg overflow-hidden border border-line"
            >
              {lead.heroImage && (
                <div className="relative h-64 md:h-96 bg-soft">
                  <Image
                    src={lead.heroImage}
                    alt=""
                    fill
                    priority
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <TopicBadge topic={lead.topic} />
                  <KindBadge kind={lead.kind} />
                  <time dateTime={isoDate(lead.publishedAt)} className="text-xs text-muted">
                    {formatDate(lead.publishedAt)}
                  </time>
                </div>
                <h1 className="text-2xl md:text-3xl font-semibold leading-tight group-hover:text-govblue">
                  {lead.title}
                </h1>
                <p className="text-muted mt-3">{lead.summary}</p>
              </div>
            </Link>

            <div className="flex flex-col gap-6">
              {sideFeatured.map((a) => (
                <Link
                  key={a.id}
                  href={`/news/${a.slug}`}
                  className="group block bg-white rounded-lg overflow-hidden border border-line flex-1"
                >
                  {a.heroImage && (
                    <div className="relative h-32 bg-soft">
                      <Image src={a.heroImage} alt="" fill className="object-cover" />
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <TopicBadge topic={a.topic} />
                      <time
                        dateTime={isoDate(a.publishedAt)}
                        className="text-xs text-muted"
                      >
                        {formatDate(a.publishedAt)}
                      </time>
                    </div>
                    <h2 className="text-base font-semibold leading-snug group-hover:text-govblue">
                      {a.title}
                    </h2>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="container py-12 grid gap-12 lg:grid-cols-3">
        {/* ---- Latest news ---- */}
        <section className="lg:col-span-2">
          <div className="flex items-center justify-between border-b-2 border-govblue pb-2 mb-2">
            <h2 className="text-xl font-semibold">News</h2>
            <Link href="/news" className="text-sm text-govblue font-medium hover:underline">
              All news →
            </Link>
          </div>
          <div>
            {latest.map((a) => (
              <ArticleRow key={a.id} article={a} />
            ))}
          </div>
        </section>

        {/* ---- Sidebar ---- */}
        <aside className="space-y-10">
          {pm && (
            <section>
              <h2 className="text-lg font-semibold border-b-2 border-govblue pb-2 mb-4">
                Prime Minister
              </h2>
              <Link href="/government" className="group block">
                <div className="flex items-center gap-4">
                  <Image
                    src={pm.photoUrl ?? "/img/pm.jpg"}
                    alt={pm.name}
                    width={88}
                    height={88}
                    className="w-22 h-22 rounded-full object-cover bg-soft"
                  />
                  <div>
                    <div className="font-semibold group-hover:text-govblue">{pm.name}</div>
                    <div className="text-sm text-muted">Prime Minister</div>
                  </div>
                </div>
              </Link>
            </section>
          )}

          <section>
            <h2 className="text-lg font-semibold border-b-2 border-govblue pb-2 mb-4">
              Direct links
            </h2>
            <ul className="grid grid-cols-2 gap-3">
              {QUICK_LINKS.map((l) => {
                const external = l.href.startsWith("http");
                const Inner = (
                  <span className="block h-full bg-soft hover:bg-govblue hover:text-white transition-colors rounded-md p-3 border border-line">
                    <span className="block text-sm font-semibold leading-snug">{l.label}</span>
                    <span className="block text-xs opacity-70 mt-0.5">{l.note}</span>
                  </span>
                );
                return (
                  <li key={l.label}>
                    {external ? (
                      <a href={l.href} target="_blank" rel="noopener noreferrer">
                        {Inner}
                      </a>
                    ) : (
                      <Link href={l.href}>{Inner}</Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        </aside>
      </div>

      {/* ---- How Government works ---- */}
      <section className="bg-soft border-y border-line">
        <div className="container py-12 grid gap-8 md:grid-cols-2 items-center">
          <Image
            src="/img/govmeeting.jpg"
            alt="The Government Session Hall at Stenbock House"
            width={620}
            height={400}
            className="w-full rounded-lg object-cover"
          />
          <div>
            <h2 className="mb-3">How the Government works</h2>
            <p className="text-muted mb-4">
              The Government of the Republic exercises executive power. It meets in regular
              session at Stenbock House, where the Prime Minister and ministers take decisions
              on the conduct of the state. Sessions are prepared by the Government Office.
            </p>
            <Link
              href="/stenbock-house"
              className="inline-block bg-govblue text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-govblue-dark"
            >
              About Stenbock House
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
