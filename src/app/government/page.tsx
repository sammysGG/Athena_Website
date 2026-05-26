import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Prime Minister & Ministers" };

export default async function GovernmentPage() {
  const ministers = await prisma.minister.findMany({ orderBy: { order: "asc" } });
  const pm = ministers.find((m) => m.title === "Prime Minister");
  const rest = ministers.filter((m) => m.title !== "Prime Minister");

  return (
    <div className="container py-10">
      <nav className="text-xs text-muted mb-2">
        <Link href="/" className="hover:underline">
          Home
        </Link>{" "}
        / Prime Minister &amp; Ministers
      </nav>
      <h1 className="mb-2">The Government</h1>
      <p className="text-muted max-w-3xl mb-10">
        The Government of the Republic is formed by the Prime Minister and the ministers. It
        exercises executive power and is accountable to the Riigikogu.
      </p>

      {pm && (
        <section className="mb-12">
          <div className="bg-soft border border-line rounded-lg p-6 flex flex-col sm:flex-row gap-6 items-start">
            <Image
              src={pm.photoUrl ?? "/img/pm.jpg"}
              alt={pm.name}
              width={160}
              height={160}
              className="w-40 h-40 rounded-lg object-cover bg-white"
            />
            <div>
              <div className="text-sm font-semibold uppercase tracking-wide text-govblue">
                Prime Minister
              </div>
              <h2 className="mt-1">{pm.name}</h2>
              {pm.party && <div className="text-sm text-muted mt-1">{pm.party}</div>}
              {pm.bio && <p className="text-muted mt-3 max-w-2xl">{pm.bio}</p>}
            </div>
          </div>
        </section>
      )}

      <h2 className="border-b-2 border-govblue pb-2 mb-6">Ministers</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((m) => (
          <div key={m.id} className="border border-line rounded-lg p-5">
            <div className="text-sm font-semibold uppercase tracking-wide text-govblue mb-1">
              {m.title}
            </div>
            <div className="text-lg font-semibold">{m.name}</div>
            {m.portfolio && <div className="text-sm text-muted mt-0.5">{m.portfolio}</div>}
            {m.party && <div className="text-xs text-muted mt-1">{m.party}</div>}
            {m.bio && <p className="text-sm text-muted mt-3">{m.bio}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
