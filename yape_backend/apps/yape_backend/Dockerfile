FROM node:latest

WORKDIR /yape_backend_app

COPY ./yape_backend/package*.json ./
RUN ls -la
COPY ./yape_backend/prisma ./prisma/
COPY ./yape_backend/data ./data/

RUN npm install

COPY ./yape_backend ./

RUN npx prisma generate
RUN echo DATABASE_URL="postgresql://postgres:postgres@postgres:5432/transactions?schema=public&sslmode=prefer" > .env
RUN npm run build

EXPOSE 3000

CMD [ "npm", "run", "start:migrate:prod" ]