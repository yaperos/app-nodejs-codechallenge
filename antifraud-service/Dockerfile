FROM node:18-alpine
RUN npm i -g pnpm
WORKDIR /user/src/app
COPY . .
RUN pnpm install
RUN pnpm build
