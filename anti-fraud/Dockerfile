FROM node:16-alpine 

# Bundle APP files
WORKDIR /usr/src/app
COPY . .

RUN yarn install
COPY . .
CMD ["npm", "run","start:dev"]