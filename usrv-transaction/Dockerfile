FROM node:19.8.1
WORKDIR /app
COPY package.json ./
RUN npm install
COPY ./ ./
RUN npm run build
CMD ["npm","run","start:prod"]