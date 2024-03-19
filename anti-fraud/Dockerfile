# Use una imagen base adecuada para tu aplicación Node.js
FROM node:20

# Establece el directorio de trabajo en /usr/src/app
WORKDIR /src/app

# Copia los archivos de configuración
COPY /package*.json ./
COPY /tsconfig.json ./

# Instala las dependencias
RUN npm install

# Copia el código fuente TypeScript
COPY ./src ./src

# Compila TypeScript a JavaScript
RUN npm run build

# Exponer el puerto en el que se ejecuta la aplicación
EXPOSE 3002

# Iniciar la aplicación
CMD ["node", "dist/app.js"]


