FROM node:18-alpine3.16
WORKDIR /app
COPY tsconfig*.json ./
COPY package*.json ./
RUN npm cache clean --force && npm install
COPY . .
# RUN npm run build
# CMD ["node", "dist/main.js"]
CMD ["npm", "run", "start:dev"]