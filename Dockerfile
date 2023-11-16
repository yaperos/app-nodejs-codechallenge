FROM node:16.20.1
WORKDIR /app
COPY package*.json ./
RUN npm config set registry http://registry.npmjs.org/
RUN npm install
RUN npm config set strict-ssl true
COPY . .
CMD [ "npm" "start"]