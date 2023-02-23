FROM node:16-alpine
 

# Create app directory.
WORKDIR /usr/src/app
COPY . .

EXPOSE 3000

RUN npm install

CMD node src/index.js