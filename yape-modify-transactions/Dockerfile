FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
RUN npx prisma generate

COPY . .

RUN npm run build

CMD [ "node", "dist/main.js"]