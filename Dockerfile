FROM node:20-bullseye

RUN npm install -g @nestjs/cli@10.3.0

COPY . .

RUN npm ci
