import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Stenbock House" };

export default function StenbockHousePage() {
  return (
    <div className="container py-10 max-w-3xl">
      <nav className="text-xs text-muted mb-2">
        <Link href="/" className="hover:underline">
          Home
        </Link>{" "}
        / Stenbock House
      </nav>
      <h1 className="mb-4">Stenbock House</h1>
      <Image
        src="/img/govmeeting.jpg"
        alt="Stenbock House, seat of the Government of the Republic"
        width={900}
        height={500}
        className="w-full rounded-lg object-cover mb-6 bg-soft"
      />
      <div className="article-body prose-gov">
        <p>
          Stenbock House (Stenbocki maja), on Toompea Hill in Tallinn, is the seat of the
          Government of the Republic of Estonia. The Government meets here in regular session,
          usually once a week, to take the decisions that direct the work of the state.
        </p>
        <p>
          Sessions are chaired by the Prime Minister and prepared by the Government Office
          (Riigikanselei), which supports the Government&apos;s work and coordinates strategy and
          communications across the ministries.
        </p>
        <p>
          The building overlooks Tallinn&apos;s old town and the Gulf of Finland and has served as
          the home of Estonia&apos;s executive since the country restored its independence.
        </p>
      </div>
    </div>
  );
}
