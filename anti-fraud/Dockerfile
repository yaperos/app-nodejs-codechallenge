FROM node:16

WORKDIR /usr/dev/anti-fraud

COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY . .

EXPOSE 4001
CMD ["npm", "run", "start:dev"]