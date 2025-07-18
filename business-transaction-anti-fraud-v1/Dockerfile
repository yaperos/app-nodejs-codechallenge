# Dockerfile para entorno de desarrollo
FROM node:18-alpine

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar TODAS las dependencias (incluyendo devDependencies)
RUN npm ci

# Copiar código fuente
COPY . .

# Exponer puerto
EXPOSE 8082

# Comando para desarrollo con hot reload
CMD ["npm", "run", "start:dev"]
