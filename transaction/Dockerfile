FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./
COPY tsconfig.json ./

RUN npm install --ignore-scripts

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
