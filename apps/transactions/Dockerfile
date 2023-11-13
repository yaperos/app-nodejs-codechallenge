# Usa una imagen de Node LTS
FROM node:lts-alpine

# Establece el directorio de trabajo
WORKDIR /usr/src/app

# Copia los archivos necesarios
COPY ./apps/transactions/package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de los archivos
COPY . .

# Expone el puerto en el que tu aplicación NestJS está ejecutándose
# EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "run", "start:prod"]