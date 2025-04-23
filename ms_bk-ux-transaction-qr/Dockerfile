FROM node:22-alpine AS development

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate


EXPOSE 3001
