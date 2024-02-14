FROM node:alpine AS development

WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

RUN npm run build

FROM node:alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

RUN npm install --production

COPY --from=development /usr/src/app/node_modules ./node_modules/
COPY --from=development /usr/src/app/package*.json ./
COPY --from=development /usr/src/app/prisma ./prisma/

CMD ["npx", "prisma", "migrate", "deploy"]