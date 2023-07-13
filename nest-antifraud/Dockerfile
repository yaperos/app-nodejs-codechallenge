FROM node:16-alpine

COPY package*.json ./

COPY tsconfig*.json ./

COPY src ./src

RUN npm install

RUN npm run build

EXPOSE 3000:3000

CMD ["npm", "start"]