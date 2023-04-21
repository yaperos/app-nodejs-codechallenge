# Imagen base de Node.js
# Base image
FROM node:16-alpine

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Creates a "dist" folder with the production build
RUN npm run build

# Expone el puerto en el que se ejecutará la aplicación
EXPOSE 3000

# Start the server using the production build
CMD ["npm", "run", "start:dev"]