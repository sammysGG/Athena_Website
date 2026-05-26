# syntax=docker/dockerfile:1.7

# --- deps -----------------------------------------------------------------
FROM node:22-alpine AS deps
WORKDIR /app
RUN apk add --no-cache openssl libc6-compat
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

# --- build ----------------------------------------------------------------
FROM node:22-alpine AS builder
WORKDIR /app
RUN apk add --no-cache openssl libc6-compat
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# --- runner ---------------------------------------------------------------
FROM node:22-alpine AS runner
WORKDIR /app
RUN apk add --no-cache openssl libc6-compat tini \
 && addgroup -g 1001 -S nodejs \
 && adduser -S -u 1001 -G nodejs nextjs

ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0

COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

# Volume mount point for the SQLite db (overridden by compose). Owned by the
# run user so the container can write into it when nothing is mounted yet.
RUN mkdir -p /app/data \
 && chown -R nextjs:nodejs /app/data

USER nextjs
EXPOSE 3000

# Seed runs once on first boot only (seed script is idempotent and skips when
# articles already exist, so live-published exercise content is never clobbered).
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["sh", "-c", "npx prisma migrate deploy && npx tsx prisma/seed.ts || true; exec npx next start -H 0.0.0.0 -p 3000"]
