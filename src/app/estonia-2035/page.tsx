import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Estonia 2035" };

export default function Estonia2035Page() {
  return (
    <div className="container py-10 max-w-3xl">
      <nav className="text-xs text-muted mb-2">
        <Link href="/" className="hover:underline">
          Home
        </Link>{" "}
        / Estonia 2035
      </nav>
      <h1 className="mb-4">Estonia 2035</h1>
      <p className="text-lg text-muted mb-6">
        Estonia 2035 is the country&apos;s long-term strategy, setting out the goals that guide the
        development of the state and the choices of every government.
      </p>
      <div className="article-body prose-gov">
        <p>
          The strategy is built around five strategic goals: a smart, active and health-conscious
          people; a society that is caring, cooperative and open; a strong and innovative economy;
          a safe and secure living environment; and a well-governed state.
        </p>
        <p>
          Security and resilience run through every goal. A safe living environment means not only
          a clean and well-planned physical space, but also robust national defence, strong
          internal security, and the cyber and societal resilience to withstand pressure.
        </p>
        <p>
          Progress is tracked against measurable indicators and reviewed regularly, so that
          long-term ambition is matched by accountability in the present.
        </p>
      </div>
    </div>
  );
}
