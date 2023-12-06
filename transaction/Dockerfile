FROM node:18

WORKDIR /challenge/src/app

COPY transaction/package*.json ./

RUN npm install

COPY ./transaction .

RUN npm run build

EXPOSE 3015

CMD ["node", "dist/src/main"]