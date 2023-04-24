ARG env

FROM node:14 as build-step

RUN mkdir -p /var/src/app

WORKDIR /usr/src/app

COPY package.json /usr/src/app

RUN npm install --scripts-prepend-node-path-auto

COPY . /usr/src/app

RUN npm run build --scripts-prepend-node-path-auto

ENV NODE_ENV=uat

expose 8080

CMD [ "node", "dist/main.js" ]