FROM node:16

COPY ["package.json", "/usr/src/"]

WORKDIR /usr/src

RUN npm install

COPY [".", "/usr/src/"]

EXPOSE 3002

CMD ["npm", "run", "start:dev"]
