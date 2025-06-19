FROM node:18-alpine

# Directorio de trabajo
WORKDIR /app

# Copiar package.json
COPY package*.json ./

# Instalar dependencias
RUN npm install --production

# Copiar código fuente
COPY index.js ./

# Variables de entorno
ENV NODE_ENV=production
ENV KAFKA_BROKER=kafka:29092

# Comando para iniciar el simulador
CMD ["node", "index.js"] 