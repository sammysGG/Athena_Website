"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import AccessibilityControls from "./AccessibilityControls";

const NAV = [
  { href: "/government", label: "Prime Minister & Ministers" },
  { href: "/news", label: "News" },
  { href: "/estonia-2035", label: "Estonia 2035" },
  { href: "/stenbock-house", label: "Stenbock House" },
];

const LANGS = [
  { code: "ET", label: "Eesti" },
  { code: "RU", label: "Русский" },
  { code: "EN", label: "English" },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    const query = q.trim();
    router.push(query ? `/news?q=${encodeURIComponent(query)}` : "/news");
    setOpen(false);
  }

  return (
    <header className="gov-surface bg-white border-b border-line sticky top-0 z-50">
      {/* Utility bar */}
      <div className="border-b border-line bg-soft">
        <div className="container flex items-center justify-between py-1.5 text-xs text-muted">
          <div className="flex items-center gap-3">
            {LANGS.map((l) => (
              <span
                key={l.code}
                className={
                  l.code === "EN"
                    ? "font-semibold text-ink"
                    : "cursor-default opacity-60"
                }
                title={l.label}
              >
                {l.code}
              </span>
            ))}
          </div>
          <AccessibilityControls />
        </div>
      </div>

      {/* Brand row */}
      <div className="container flex items-center justify-between gap-4 py-3">
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <Image
            src="/img/coat-of-arms.png"
            alt="Coat of arms of Estonia"
            width={46}
            height={46}
            priority
          />
          <span className="leading-tight">
            <span className="block text-[1.05rem] sm:text-xl font-semibold tracking-tight">
              Vabariigi Valitsus
            </span>
            <span className="block text-[0.7rem] sm:text-xs text-muted uppercase tracking-wide">
              Government of the Republic of Estonia
            </span>
          </span>
        </Link>

        <form onSubmit={submitSearch} className="hidden md:flex items-center" role="search">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search news…"
            aria-label="Search news"
            className="w-56 lg:w-72 border border-line rounded-l-md px-3 py-2 text-sm outline-none focus:border-govblue"
          />
          <button
            type="submit"
            className="bg-govblue text-white px-3 py-2 rounded-r-md text-sm font-medium hover:bg-govblue-dark"
          >
            Search
          </button>
        </form>

        <button
          type="button"
          className="md:hidden p-2 -mr-2"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span className="block w-6 h-0.5 bg-ink mb-1.5" />
          <span className="block w-6 h-0.5 bg-ink mb-1.5" />
          <span className="block w-6 h-0.5 bg-ink" />
        </button>
      </div>

      {/* Primary nav */}
      <nav className="hidden md:block border-t border-line">
        <div className="container flex items-stretch gap-1">
          {NAV.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
                  active
                    ? "border-govblue text-govblue"
                    : "border-transparent text-ink hover:text-govblue hover:border-line"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <nav className="md:hidden border-t border-line bg-white">
          <div className="container py-3 flex flex-col gap-1">
            <form onSubmit={submitSearch} className="flex mb-2" role="search">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search news…"
                aria-label="Search news"
                className="flex-1 border border-line rounded-l-md px-3 py-2 text-sm outline-none focus:border-govblue"
              />
              <button
                type="submit"
                className="bg-govblue text-white px-3 rounded-r-md text-sm font-medium"
              >
                Go
              </button>
            </form>
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="py-2 text-sm font-medium border-b border-line"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
