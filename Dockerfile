# ── Stage 1: Builder ─────────────────────────────
FROM node:22-alpine AS builder

RUN apk add --no-cache python3 make g++ libc6-compat openssl

WORKDIR /src

RUN npm install -g pnpm@10

COPY package.json pnpm-lock.yaml ./
RUN HUSKY=0 pnpm install --frozen-lockfile

COPY . .

RUN npx prisma generate

RUN pnpm run build

# ── Stage 2: Runner ──────────────────────────────
FROM node:22-alpine AS runner

RUN apk add --no-cache \
    libc6-compat \
    openssl \
    ca-certificates \
    wget

WORKDIR /src

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /src/.next/standalone ./
COPY --from=builder /src/.next/static ./.next/static
COPY --from=builder /src/public ./public

COPY --from=builder /src/generated ./generated
COPY --from=builder /src/prisma ./prisma
COPY --from=builder /src/node_modules/@prisma ./node_modules/@prisma

RUN chown -R nextjs:nodejs /src

USER nextjs

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
    CMD wget --spider -q http://localhost:3000 || exit 1

LABEL org.opencontainers.image.title="WatchWave"
LABEL org.opencontainers.image.description="WatchWave Next.js application"
LABEL org.opencontainers.image.source="https://github.com/Punit-99/watchWave"
LABEL org.opencontainers.image.version="1.0.0"

CMD ["node", "server.js"]