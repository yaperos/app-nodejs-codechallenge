 FROM node:16.15.0
 WORKDIR /usr/src/app
 COPY package*.json ./
 RUN npm install
 COPY . .
 RUN npm run build:transaction
 EXPOSE 3000
 CMD ["npm", "run", "start:prod"]