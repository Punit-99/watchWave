FROM node:22-alpine

# Set working directory inside container
WORKDIR /src

# Install pnpm globally inside container
RUN npm install -g pnpm
ENV PNPM_ENABLE_SCRIPTS=1
# --------------------------------------------------
# 1. Copy only dependency files first (for Docker cache optimization)
#    This allows Docker to reuse this layer if deps don't change
# --------------------------------------------------
COPY package.json pnpm-lock.yaml ./

# --------------------------------------------------
# 2. Allow pnpm to run required build scripts (IMPORTANT FIX)
#    Needed for: prisma, bcrypt, sharp, esbuild, etc.
# --------------------------------------------------
RUN pnpm config set ignore-scripts false

# --------------------------------------------------
# 3. Install dependencies using lockfile (safe & reproducible)
# --------------------------------------------------
RUN pnpm install --frozen-lockfile

# --------------------------------------------------
# 4. Copy Prisma schema before generating client
# --------------------------------------------------
COPY prisma ./prisma

# --------------------------------------------------
# 5. Generate Prisma client (required for DB access)
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

# Expose Next.js port
EXPOSE 3000

# Start production server
CMD ["pnpm", "start"]