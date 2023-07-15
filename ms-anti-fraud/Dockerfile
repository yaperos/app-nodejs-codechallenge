FROM node:18-alpine
WORKDIR /app-anti-fraud
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "run", "start:prod"]