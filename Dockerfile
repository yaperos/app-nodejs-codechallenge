FROM node:18-alpine3.16

WORKDIR /api-transactions/src/main

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

CMD ["node", "dist/apps/api-transactions/main.js"]