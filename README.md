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
| Runtime | systemd (`next start` as www-data, fronted by nginx) |

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

`admin` (`admin@valitsus.local`) / `Cool2Pass` — **change this before any real use.**

## Scenario content

The seed (`prisma/seed.ts`) creates a fictional government cast and ~11 press releases that
track the Tw@er storyline: overnight cyber activity against municipal services, Spring Storm
2026, counter-drone measures, a measured statement on Donovian rhetoric, Tallinn port
normality, NATO coordination, disinformation guidance and the NB8 summit. Seeding is
idempotent — it only inserts articles when the table is empty, so content published live
during the exercise is never clobbered on service restart.

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

### systemd (production)

On a range box this is provisioned by the Ansible role in `deploy.yml`: it installs
Node + nginx, builds the app, and installs a `valitsus.service` unit that runs
`prisma migrate deploy` (ExecStartPre) then `next start -H 127.0.0.1 -p 18092` as the
`www-data` user. The SQLite db lives in `./data` (owned by `www-data`) and survives the
boot-time `git reset --hard` rebuild, so live-published content is never clobbered.

```bash
sudo systemctl status valitsus.service     # app
journalctl -u valitsus.service -f          # logs
```

## Deployment

Fronted by nginx (self-signed range cert at `/etc/ssl/range`), `proxy_pass` →
`127.0.0.1:18092`. The boot-time `valitsus-update.service` pulls `origin/main`, rebuilds,
and restarts the app on every boot.
