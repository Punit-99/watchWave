FROM node:22-alpine

# --------------------------------------------------
# 0. Set working directory
# --------------------------------------------------
WORKDIR /src

# --------------------------------------------------
# 1. Install pnpm globally (package manager)
# --------------------------------------------------
RUN npm install -g pnpm

# --------------------------------------------------
# 2. Copy dependency files first (for Docker caching)
#    - This layer is reused if dependencies don't change
# --------------------------------------------------
COPY package.json pnpm-lock.yaml ./

# --------------------------------------------------
# 3. IMPORTANT: Allow pnpm to run required build scripts
#    (prisma, bcrypt, sharp, esbuild, etc.)
# --------------------------------------------------
RUN pnpm config set enable-pre-post-scripts true

# --------------------------------------------------
# 4. Install dependencies (reproducible install)
#    - frozen-lockfile ensures exact versions
# --------------------------------------------------
RUN pnpm install --frozen-lockfile

# --------------------------------------------------
# 5. Copy Prisma schema before generating client
# --------------------------------------------------
COPY prisma ./prisma

# --------------------------------------------------
# 6. Generate Prisma Client (required for DB access)
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