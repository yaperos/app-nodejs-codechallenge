ARG PORT=2000
ARG GENERAL_HOST=2000

FROM node:16-alpine

WORKDIR /app

COPY package.json .
COPY package-lock.json .
RUN npm install

COPY . ./

RUN npm run build

EXPOSE ${PORT}

ENTRYPOINT ["npm","run","start"]