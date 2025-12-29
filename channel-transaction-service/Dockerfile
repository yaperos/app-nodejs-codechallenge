# Usamos la imagen base oficial de Node.js
FROM node:20-alpine

# Establecemos el directorio de trabajo en el contenedor
WORKDIR /app

# Copiamos los archivos de configuración de npm
COPY package*.json ./
RUN npm install

# Copiamos el resto del código de la app
COPY . .

# Exponemos el puerto en el que la app va a correr
EXPOSE 3001

# Comando para iniciar el servicio en modo desarrollo
CMD ["npm", "run", "start:dev"]
