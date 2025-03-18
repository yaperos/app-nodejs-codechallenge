FROM node:20

WORKDIR /app

COPY ./package*.json ./
RUN npm install --omit=dev

COPY . .

RUN npm run build

CMD ["node", "./dist/server.js"]
