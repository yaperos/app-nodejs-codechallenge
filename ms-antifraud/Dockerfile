FROM node:20

COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json

WORKDIR /app

COPY . /app

RUN npm install

CMD ["npm", "run", "start"]
