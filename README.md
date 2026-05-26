# Vabariigi Valitsus — mock Government of Estonia site

A mock of the Estonian government portal (styled after [valitsus.ee](https://valitsus.ee/en)),
built for the same fictional **Estonia / Donovia / NATO** scenario as the paired
[Tw@er](../twatter) social-media mock. It publishes official-looking government news,
statements and decisions, and includes an admin newsroom for injecting content live during
an exercise.

> **Exercise material.** All names, ministers and articles are fictional and are *not* an
> official publication of the Government of the Republic of Estonia. A notice to this effect
> sits in the site footer. Visual assets (coat of arms, photos) were pulled from valitsus.ee
> for fidelity.

## Stack (same template as Tw@er)

| Layer | Choice |
| --- | --- |
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind v4 |
| Auth | NextAuth.js, Credentials provider, JWT sessions |
| DB | SQLite via Prisma |
| Passwords | bcryptjs |
| Runtime | Docker (multi-stage, runs as non-root) |

## Pages

- `/` — home: featured hero, latest news, direct links, PM card, "How Government works".
- `/news` — listing with topic filters and `?q=` search.
- `/news/[slug]` — article / press release. Drafts & scheduled items are admin-preview only.
- `/government` — Prime Minister & ministers.
- `/estonia-2035`, `/stenbock-house` — static info pages.
- `/sign-in` — staff login. `/admin` — the **Newsroom** (publish / edit / pin / feature /
  draft / schedule). Admin-only.

Accessibility controls (text resize, high-contrast yellow-on-black) mirror valitsus.ee and
persist in `localStorage`.

## Default admin

`admin@valitsus.local` / `admin1234` — **change this before any real use.**

## Scenario content

The seed (`prisma/seed.ts`) creates a fictional government cast and ~11 press releases that
track the Tw@er storyline: overnight cyber activity against municipal services, Spring Storm
2026, counter-drone measures, a measured statement on Donovian rhetoric, Tallinn port
normality, NATO coordination, disinformation guidance and the NB8 summit. Seeding is
idempotent — it only inserts articles when the table is empty, so content published live
during the exercise is never clobbered on container restart.

## API

| Method | Path | Auth | Notes |
| --- | --- | --- | --- |
| `GET`  | `/api/articles` | — | public articles; `?all=1` (admin) returns drafts/scheduled; `?topic=` filter |
| `POST` | `/api/articles` | admin | create / publish |
| `PATCH`| `/api/articles/:id` | admin | edit, toggle pinned/featured/status, schedule |
| `DELETE`| `/api/articles/:id` | admin | delete |

## Run

```bash
cp .env.example .env          # set NEXTAUTH_SECRET, NEXTAUTH_URL
npm install
npx prisma migrate dev
npm run db:seed
npm run dev                   # http://localhost:3000
```

### Docker (production)

```bash
docker compose up -d --build  # binds 127.0.0.1:18092 -> 3000
```

The container runs `prisma migrate deploy` then the seed (idempotent) on boot. The SQLite db
lives in the `./data` volume — **it must be owned by uid 1001** (the container's `nextjs`
user): `chown -R 1001:1001 data`.

## Deployment

Fronted by nginx at **scada.goathost.gg** (Let's Encrypt), `proxy_pass` → `127.0.0.1:18092`.
This swapped in for Tw@er; the previous nginx config is backed up alongside
`/etc/nginx/sites-available/scada.goathost.gg.conf`. To swap Tw@er back: start its container
(`cd /var/www/twatter && docker compose up -d`) and point `proxy_pass` back to `:18091`.
