FROM node:22-alpine AS development

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 3002


FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY . .
RUN npx prisma generate && npm run build

FROM node:22-alpine AS production

WORKDIR /app

COPY --from=build /app /app

EXPOSE 3002

CMD sh -c "npx prisma migrate deploy && npm run start:prod"
