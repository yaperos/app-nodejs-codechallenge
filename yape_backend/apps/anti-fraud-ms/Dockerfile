FROM node:latest

WORKDIR /anti-fraud-ms-app

COPY ./yape_backend/package*.json ./
RUN ls -la

RUN npm install

COPY ./yape_backend/ ./

RUN npm run build

CMD [ "npm", "start", "anti-fraud-ms" ]