FROM node:alpine As development

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install

RUN wget https://github.com/jwilder/dockerize/releases/download/v0.6.1/dockerize-linux-amd64-v0.6.1.tar.gz
RUN tar -C /usr/local/bin -xzvf dockerize-linux-amd64-v0.6.1.tar.gz

COPY . .

RUN npm run build