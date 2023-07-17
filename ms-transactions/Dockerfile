# Imagen base
FROM node:16-alpine

# Directorio de trabajo en el contenedor
WORKDIR /app

# Copiar archivos de la aplicación
COPY package.json package-lock.json /app/

# Instalar dependencias
RUN npm install --production

# Copiar el código fuente de la aplicación
COPY . /app

# Puerto expuesto por la aplicación
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["npm", "start"]