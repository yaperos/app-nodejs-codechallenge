FROM node:16 as build
RUN npm install -g typescript
RUN npm install -g pm2
RUN pm2 install pm2-logrotate && pm2 set pm2-logrotate:max_size 10M && pm2 set pm2-logrotate:compress true
WORKDIR /app
COPY package.json package-lock.json ./
COPY lerna.json ./

RUN mkdir packages
WORKDIR /packages

RUN mkdir shared-module
RUN mkdir antifraud-service
WORKDIR /app

RUN mkdir logs

WORKDIR /app/logs
RUN touch antifraud-service-output.log
RUN touch antifraud-service-error.log

WORKDIR /app
COPY ./packages/shared-module/ /app/packages/shared-module
WORKDIR /app/packages/shared-module
RUN npm run build
WORKDIR /app
COPY ./packages/antifraud-service/ /app/packages/antifraud-service
RUN npm install
WORKDIR /app/packages/antifraud-service
EXPOSE 4001
CMD [ "pm2", "start", "./ecosystem.config.js", "--no-daemon"]
