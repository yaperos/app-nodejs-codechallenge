FROM node:20

RUN cd /root && touch ".builded.$(date +%F_%R)"
COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json

WORKDIR /app
RUN npm ci

COPY . /app

CMD ["npm", "run", "start"]
