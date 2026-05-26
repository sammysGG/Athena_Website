import Link from "next/link";

const EXTERNAL = [
  { label: "President of the Republic", href: "https://www.president.ee/en" },
  { label: "Riigikogu (Parliament)", href: "https://www.riigikogu.ee/en" },
  { label: "State Gazette (Riigi Teataja)", href: "https://www.riigiteataja.ee/en" },
  { label: "Crisis information — kriis.ee", href: "https://www.kriis.ee/en" },
  { label: "State services — eesti.ee", href: "https://www.eesti.ee/en" },
];

const MINISTRIES = [
  "Ministry of Foreign Affairs",
  "Ministry of Defence",
  "Ministry of the Interior",
  "Ministry of Justice",
  "Ministry of Economic Affairs and Communications",
  "Ministry of Finance",
];

export default function Footer() {
  return (
    <footer className="gov-surface bg-govblue-dark text-white/90 mt-16">
      <div className="container py-12 grid gap-10 md:grid-cols-4">
        <div>
          <div className="font-semibold text-white mb-2">Government of the Republic</div>
          <address className="not-italic text-sm leading-relaxed text-white/80">
            Stenbock House
            <br />
            Rahukohtu St 3
            <br />
            15161 Tallinn, Estonia
            <br />
            <span className="inline-block mt-2">Tel. +372 693 5710</span>
            <br />
            <a href="mailto:riigikantselei@riigikantselei.ee" className="underline">
              riigikantselei@riigikantselei.ee
            </a>
          </address>
        </div>

        <div>
          <div className="font-semibold text-white mb-2">Ministries</div>
          <ul className="text-sm space-y-1 text-white/80">
            {MINISTRIES.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </div>

        <div>
          <div className="font-semibold text-white mb-2">Useful links</div>
          <ul className="text-sm space-y-1">
            {EXTERNAL.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-white underline underline-offset-2"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="font-semibold text-white mb-2">Newsletter</div>
          <p className="text-sm text-white/80 mb-3">
            Subscribe to receive Government news by email.
          </p>
          <form
            className="flex"
            action="/news"
            method="get"
            aria-label="Newsletter signup (demo)"
          >
            <input
              type="email"
              placeholder="your@email.ee"
              aria-label="Email address"
              className="flex-1 rounded-l-md px-3 py-2 text-sm text-ink outline-none"
            />
            <button
              type="submit"
              className="bg-white text-govblue-dark font-medium px-3 rounded-r-md text-sm"
            >
              Subscribe
            </button>
          </form>
          <div className="flex gap-3 mt-4 text-white/70 text-sm">
            <span>Facebook</span>
            <span>X</span>
            <span>YouTube</span>
            <span>RSS</span>
          </div>
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="container py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/60">
          <span>© {new Date().getFullYear()} Government of the Republic of Estonia</span>
          <Link href="/sign-in" className="hover:text-white/90">
            Staff login
          </Link>
        </div>
        {/* Exercise / scenario notice — unobtrusive, for responsible hosting. */}
        <div className="container pb-4 text-[0.65rem] leading-snug text-white/35">
          Training and exercise environment. Scenario content is fictional and is not an
          official publication of the Government of the Republic of Estonia.
        </div>
      </div>
    </footer>
  );
}
