FROM node:18
WORKDIR /usr/src/app
RUN npm install -g typescript
COPY package*.json ./
RUN npm install
COPY . .
RUN tsc
EXPOSE 4001
CMD [ "npm", "start" ]