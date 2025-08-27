# Usa una imagen oficial de Node.js como base
FROM node:20-alpine

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos de dependencias
COPY package*.json ./

# Instala las dependencias
RUN npm install --production

# Copia el resto de la aplicación
COPY . .

# Compila el proyecto (si usas TypeScript)
RUN npm run build

# Expone el puerto de la aplicación
EXPOSE 3000

# Comando para iniciar la app
CMD ["node", "dist/main.js"]
