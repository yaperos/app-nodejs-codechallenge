FROM node:22-alpine AS development

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3003

FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY . .

RUN npm run build

FROM node:22-alpine AS production

WORKDIR /app

COPY --from=build /app /app

EXPOSE 3003

CMD sh -c "npm run start:prod"
