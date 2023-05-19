# Utiliza la imagen base de Node.js
FROM node:14-alpine

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de la API de Transacciones al contenedor
COPY . .

# Instala las dependencias
RUN npm install

# Expone el puerto en el que se ejecutará la API
EXPOSE 3000

# Ejecuta el comando para iniciar la API de Transacciones
CMD [ "npm", "start" ]