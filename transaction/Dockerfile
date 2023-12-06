FROM node:18.12.0-buster

WORKDIR /challenge/src/app

COPY package.json package-lock.json tsconfig.json nest-cli.json .eslintrc.js .prettierrc tsconfig.build.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 8080

CMD ["node", "dist/src/main"]