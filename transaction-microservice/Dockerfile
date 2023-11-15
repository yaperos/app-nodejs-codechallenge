# use the official Bun image
FROM oven/bun:1 as base
COPY --from=node:18 /usr/local/bin/node /usr/local/bin/node

WORKDIR /usr/src/app/transaction-microservice

# install dependencies
COPY package.json bun.lockb ./
RUN bun install
RUN bunx prisma migrate dev
RUN bunx prisma generate

# copy all project files into the image
COPY . .

# run the app
USER bun
EXPOSE 3000/tcp