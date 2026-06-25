FROM node:22-alpine

# --------------------------------------------------
# 0. Set working directory
# --------------------------------------------------
WORKDIR /src

# --------------------------------------------------
# 1. Install pnpm globally
# --------------------------------------------------
RUN npm install -g pnpm

# --------------------------------------------------
# 2. Copy dependency files first (for Docker caching)
#    This layer is reused if dependencies don't change
# --------------------------------------------------
COPY package.json pnpm-lock.yaml ./

# --------------------------------------------------
# 3. Install dependencies (SAFE FIX FOR PNPM v9+)
#    - allow native build scripts (prisma, bcrypt, sharp)
#    - keep deterministic lockfile
# --------------------------------------------------
RUN pnpm install --frozen-lockfile --ignore-scripts=false

# --------------------------------------------------
# 4. Copy Prisma schema before generating client
# --------------------------------------------------
COPY prisma ./prisma

# --------------------------------------------------
# 5. Generate Prisma Client (required for DB access)
# --------------------------------------------------
RUN npx prisma generate

# --------------------------------------------------
# 6. Copy full application source code
# --------------------------------------------------
COPY . .

# --------------------------------------------------
# 7. Build Next.js production app
# --------------------------------------------------
RUN pnpm run build

# --------------------------------------------------
# 8. Expose Next.js port
# --------------------------------------------------
EXPOSE 3000

# --------------------------------------------------
# 9. Start production server
# --------------------------------------------------
CMD ["pnpm", "start"]