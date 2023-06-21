FROM node:18-alpine as base

ARG app
RUN npm install -g ts-node typescript
COPY ./${app} /opt/app
WORKDIR /opt/app
RUN npm install
RUN npm install --save-dev
RUN npm run build
EXPOSE  3000

CMD ["npm", "run", "start"]