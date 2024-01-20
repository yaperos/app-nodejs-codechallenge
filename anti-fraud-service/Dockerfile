# Usar la imagen de Node.js v16.20.2
FROM node:16.20.2

# Crear un directorio de trabajo
WORKDIR /usr/src/app

# Copiar package.json y package-lock.json (o yarn.lock si se usa Yarn)
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar los archivos del proyecto
COPY . .

# Exponer el puerto en el que se ejecuta el servicio
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["npm", "start"]
