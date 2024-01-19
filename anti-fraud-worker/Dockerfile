FROM node:20-alpine as dev
WORKDIR /app
COPY package.json .
RUN npm install 
COPY . .
CMD [ "npm", "run", "dev"]


FROM node:20-alpine as prod
WORKDIR /app
COPY package.json .
RUN npm install 
COPY . .
CMD [ "npm", "run", "start"]