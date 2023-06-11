####################################
#########   BUILDER step   #########
####################################

FROM node:15.5.0-alpine3.12 AS builder

WORKDIR /app

COPY package*.json ./

COPY tsconfig*.json ./

COPY ./src ./src

RUN npm install --legacy-peer-deps && npm run build

####################################
#######   PRODUCTION step   ########
####################################

FROM node:15.5.0-alpine3.12

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001

COPY package.json .

RUN npm install --legacy-peer-deps

COPY --from=builder /app/dist ./dist

EXPOSE 3001

CMD ["node", "dist/main"]