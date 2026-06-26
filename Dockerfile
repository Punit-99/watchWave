# ── Stage 1: Builder ─────────────────────────────
FROM node:22-alpine AS builder

# Native build tools required for bcrypt + sharp
RUN apk add --no-cache python3 make g++ libc6-compat openssl

WORKDIR /src

RUN npm install -g pnpm@10

# Copy lockfile first — layer cache skips install if unchanged
COPY package.json pnpm-lock.yaml ./
RUN HUSKY=0 pnpm install --frozen-lockfile

# Copy source + generate Prisma client (outputs to /src/generated/prisma)
COPY . .
RUN npx prisma generate

# Compile TS → JS, output to .next/standalone
RUN pnpm run build


# ── Stage 2: Runner ──────────────────────────────
FROM node:22-alpine AS runner

RUN apk add --no-cache libc6-compat openssl

WORKDIR /src

# Non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser  --system --uid 1001 nextjs

# Next.js compiled output
COPY --from=builder /src/.next/standalone ./
COPY --from=builder /src/.next/static     ./.next/static
COPY --from=builder /src/public ./public

# Prisma generated client + schema + adapter packages
COPY --from=builder /src/generated            ./generated
COPY --from=builder /src/prisma               ./prisma
COPY --from=builder /src/node_modules/@prisma ./node_modules/@prisma

RUN chown -R nextjs:nodejs /src

USER nextjs

# DATABASE_URL is injected at runtime — never baked into the image
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME="0.0.0.0"

EXPOSE 3000

CMD ["node", "server.js"]