ARG NODE_VERSION=18.17.0
ARG NODE_ENV=build
ARG APP_PORT=3000
ARG IMAGE_NAME=antifraude

# Utiliza una versión ligera de Node.js como imagen base
FROM node:${NODE_VERSION}-alpine as builder
# Establece la variable de entorno NODE_ENV a partir del ARG
ENV NODE_ENV=${NODE_ENV}

# Define el directorio de trabajo en el contenedor
WORKDIR /usr/src/app

# Copia los archivos package.json y yarn.lock al contenedor
COPY package*.json ./

# Instala las dependencias del proyecto utilizando Yarn
RUN yarn install

# Copia el resto del código del proyecto al contenedor
COPY . .

# Construye la aplicación
RUN yarn build

# Comienza una nueva etapa para reducir el tamaño de la imagen final
FROM node:${NODE_VERSION}-alpine
# Información sobre la imagen, con el valor de la etiqueta name parametrizado
LABEL name=${IMAGE_NAME}

# Define un usuario sin privilegios para ejecutar la aplicación
USER node
# Define el directorio de trabajo en el contenedor
WORKDIR /usr/src/app

# Copia los archivos y directorios desde la etapa de construcción
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/node_modules/ ./node_modules/
COPY --from=builder /usr/src/app/dist ./dist

# Expone el puerto que usa la aplicación
EXPOSE ${APP_PORT}
# Define el comando para iniciar la aplicación
CMD ["yarn", "start"]