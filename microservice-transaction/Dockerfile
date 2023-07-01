FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN yarn

COPY src/infrastructure/config/prisma/schema.prisma ./prisma/

COPY src/infrastructure/config/prisma/migrations/ ./prisma/migrations/

RUN npx prisma generate --schema ./prisma/schema.prisma

COPY . .

RUN yarn run build

CMD ["yarn", "run", "start:migrate:prod"]

EXPOSE 3000