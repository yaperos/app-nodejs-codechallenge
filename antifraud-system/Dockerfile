# Utiliza la imagen base de Node.js
FROM node:14-alpine

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de la API de AntiFraude al contenedor
COPY . .

# Instala las dependencias
RUN npm install

# Expone el puerto en el que se ejecutará la API
EXPOSE 4000

# Ejecuta el comando para iniciar la API de AntiFraude
CMD [ "npm", "start" ]