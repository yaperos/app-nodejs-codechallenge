FROM node:18

WORKDIR /challenge/src/app

COPY anti-fraud/package*.json ./

RUN npm install

COPY ./anti-fraud .

CMD ["node", "consumer"]
