FROM node:20-bookworm

# 1. Definir directorio de trabajo
WORKDIR /app

# 2. Copiar y instalar dependencias (incluyendo devDependencies para Prisma CLI)
COPY package.json package-lock.json* ./
RUN npm install

# 3. Copiar carpeta prisma
COPY prisma ./prisma

# 4. Copiar el resto del código
COPY . .

# 5. Generar cliente Prisma
RUN npx prisma generate

CMD ["sh", "-c", "npx prisma generate && npx prisma migrate deploy && node src/index.js"]
