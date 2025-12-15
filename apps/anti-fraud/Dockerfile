# Usa una imagen ligera de Node
FROM node:18-alpine

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos archivos de dependencias primero (para aprovechar el caché de Docker)
COPY package*.json ./

# Instalamos dependencias
RUN npm install

# Copiamos el resto del código
COPY . .

# Generamos el cliente de Prisma (Si usas Prisma, descomenta esta línea)
# RUN npx prisma generate

# Construimos la aplicación NestJS
RUN npm run build

# Comando para iniciar la app (dist/main es el estándar de NestJS)
CMD ["node", "dist/main"]