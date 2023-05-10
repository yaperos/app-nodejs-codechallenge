FROM node:14.15.0-buster-slim

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY /src/transaction/package*.json ./

RUN npm install

# Bundle app source
COPY /src/transaction .

EXPOSE 5000
RUN npm run migration
CMD ["npm","start"]