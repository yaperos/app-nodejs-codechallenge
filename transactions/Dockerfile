# Define la imagen base (Node.js, por ejemplo)
FROM node:16.6-alpine

# Copia los archivos de la aplicación al contenedor
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Puerto en el que se ejecutará la aplicación
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm","run","start:dev"]
