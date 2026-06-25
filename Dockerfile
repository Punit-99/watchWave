FROM node:22-alpine

WORKDIR /src

# Enable pnpm
RUN npm install -g pnpm

# 1. Copy dependency files first (for caching)
COPY package.json pnpm-lock.yaml ./

# 2. Install dependencies  will fix : Only allow trusted packages to run install scripts
RUN pnpm install --frozen-lockfile



# 3. Copy prisma schema
COPY prisma ./prisma

# 4. Generate Prisma client
RUN npx prisma generate

# 5. Copy rest of app
COPY . .

# 6. Build Next.js app
RUN pnpm run build

EXPOSE 3000

CMD ["pnpm", "start"]