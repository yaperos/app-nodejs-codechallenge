FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Ejecutar tests en cada inicio de contenedor antes de iniciar la app
EXPOSE 3003
RUN npm run build
RUN npm test
EXPOSE 3003
CMD ["npm", "run", "start:prod"]
