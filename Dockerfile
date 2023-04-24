FROM node:16.13.0
WORKDIR /usr/src/app
RUN rm -rf ./*
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build:transaction
EXPOSE 3000
CMD ["npm", "run", "start:prod"]