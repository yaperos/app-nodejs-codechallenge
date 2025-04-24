# Usa una imagen oficial de Node.js como base
FROM node:18-alpine

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos necesarios para instalar dependencias
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del proyecto al contenedor
COPY . .

# Construye el proyecto TypeScript
RUN npm run build

# Expone el puerto donde corre la app NestJS
EXPOSE 3000

# Comando por defecto al levantar el contenedor
CMD ["node", "dist/main"]
