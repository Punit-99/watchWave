FROM node:22-alpine

# --------------------------------------------------
# 0. Native build tools for bcrypt + sharp
# --------------------------------------------------
RUN apk add --no-cache python3 make g++ libc6-compat openssl

# --------------------------------------------------
# 1. Set working directory
# --------------------------------------------------
WORKDIR /src

# --------------------------------------------------
# 2. Install pnpm — pin to match your local v10
# --------------------------------------------------
RUN npm install -g pnpm@10

# --------------------------------------------------
# 3. Copy dependency files first (for Docker caching)
# --------------------------------------------------
COPY package.json pnpm-lock.yaml ./

# --------------------------------------------------
# 4. Install dependencies
#    onlyBuiltDependencies in package.json handles
#    the script allowlist — no extra flags needed
# --------------------------------------------------
RUN pnpm install --frozen-lockfile

# --------------------------------------------------
# 5. Copy Prisma schema before generating client
# --------------------------------------------------
COPY prisma ./prisma

# --------------------------------------------------
# 6. Generate Prisma Client
# --------------------------------------------------
RUN npx prisma generate

# --------------------------------------------------
# 7. Copy full application source code
# --------------------------------------------------
COPY . .

# --------------------------------------------------
# 8. Build Next.js production app
# --------------------------------------------------
RUN pnpm run build

# --------------------------------------------------
# 9. Expose Next.js port
# --------------------------------------------------
EXPOSE 3000

# --------------------------------------------------
# 10. Start production server
# --------------------------------------------------
CMD ["pnpm", "start"]