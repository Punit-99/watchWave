FROM node:22-alpine

WORKDIR /src

# 1. Copy dependency files first (for caching)
COPY package*.json ./

RUN npm install

# 2. Copy prisma schema BEFORE generate
COPY prisma ./prisma

# 3. Generate Prisma client inside container
RUN npx prisma generate

# 4. Copy rest of the application
COPY . .

# 5. Build app
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]