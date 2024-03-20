FROM node:21-alpine3.18 AS base

WORKDIR /usr/src/app


FROM base AS development

ENV NODE_ENV=development

COPY package*.json ./
COPY prisma ./prisma/
RUN npm install

COPY . .

# RUN npx prisma migrate deploy

EXPOSE 3000

CMD ["npm", "run", "start"]

# docker-compose up --build --scale ms-transaction=0 && docker-compose exec ms-transaction sh -c "npx prisma migrate deploy && npm run start"
