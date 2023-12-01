FROM node:20-alpine as builder
WORKDIR /app
COPY . .
RUN npm i

#ENV DATABASE_URL "postgres://postgres:sD7IglOj8fwQacT3@db.rbakrhawjgkpcctivmmx.supabase.co:5432/postgres"

RUN npm run prisma:deploy

RUN apk update && apk add postgresql-client
RUN sh ./scripts/init_db.sh

RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules/ ./node_modules/
COPY --from=builder /app/dist/ ./dist/

CMD [ "npm", "start:prod"]