# Usa una imagen de Node LTS
FROM node:lts-alpine

# Establece el directorio de trabajo
WORKDIR /usr/src/app

# Copia los archivos necesarios
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de los archivos
COPY ./apps/consumer .

EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "run", "start:prod"]