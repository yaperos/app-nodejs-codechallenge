FROM node:16-alpine

COPY package*.json ./

COPY tsconfig*.json ./

COPY src ./src

RUN npm install

RUN npm run build

CMD ["npm", "start"]