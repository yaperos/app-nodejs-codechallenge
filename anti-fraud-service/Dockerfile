FROM node:20

WORKDIR /app

COPY ./package*.json ./

RUN npm install --omit=dev

# Instala temporalmente las dependencias de desarrollo para el build
RUN npm install --save-dev @types/express

COPY . .

RUN npm run build

CMD ["node", "./dist/index.js"]
