FROM node:20-bookworm

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY prisma ./prisma

COPY . .

RUN npx prisma generate

CMD ["sh", "-c", "npx prisma generate && npx prisma migrate deploy && node src/index.js"]
