FROM node:18.17.0

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

# EXPOSE 3000

RUN npm run build

CMD ["npm", "run", "start:dev"]