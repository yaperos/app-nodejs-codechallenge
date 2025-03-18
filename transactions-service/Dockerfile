FROM node:20

WORKDIR /app

# Copiar solo package.json y package-lock.json para aprovechar el caché
COPY ./package*.json ./
RUN npm install --omit=dev

# Copiar el resto del código fuente
COPY . .

# Compilar el proyecto
RUN npm run build

# Ejecutar Prisma Migrate antes de levantar el servicio
CMD ["sh", "-c", "npx prisma generate && npx prisma migrate deploy && node ./dist/server.js"]
