# apps/transaction/Dockerfile
FROM node:18-alpine

WORKDIR /app

# Esta línea es VITAL para Alpine
RUN apk add --no-cache openssl libc6-compat

COPY package*.json ./

RUN npm install

COPY . .

# Usamos la ruta explícita del esquema por seguridad
RUN npx prisma generate --schema=./prisma/schema.prisma

RUN npm run build

CMD ["npm", "run", "start:prod"]