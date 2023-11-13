# api-gateway/Dockerfile
FROM node:16-alpine

WORKDIR /usr/src/app

# Instalar dependencias de la aplicación
# Utiliza el comodín para asegurarte de que tanto package.json como package-lock.json sean copiados
COPY package*.json ./

# Instalar dependencias de Node
RUN npm install

# Copiar todos los archivos del proyecto al contenedor
COPY . .

# Exponer el puerto que usa tu aplicación
EXPOSE 4000

# Comando para ejecutar la aplicación
CMD ["npm", "start"]