FROM node:16 as builder

WORKDIR /app
COPY ./transaction-microservice/package*.json ./
COPY ./transaction-microservice/prisma ./prisma/
RUN npm i
COPY ./transaction-microservice .
RUN npm run build

FROM node:16

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD [  "npm", "run", "start:migrate:prod" ]