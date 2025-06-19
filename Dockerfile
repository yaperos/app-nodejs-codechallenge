# Usar Node.js 18 con Alpine (imagen ligera)
FROM node:18-alpine

# Directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production && npm cache clean --force

# Copiar archivos de configuración
COPY tsconfig*.json ./
COPY nest-cli.json ./

# Copiar código fuente
COPY src/ ./src/

# Compilar aplicación TypeScript
RUN npm run build

# Exponer puerto
EXPOSE 3000

# Variables de entorno
ENV NODE_ENV=production
ENV PORT=3000

# Comando para iniciar la aplicación
CMD ["node", "dist/main.js"] 