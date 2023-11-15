# use the official Bun image
FROM oven/bun:1 as base

WORKDIR /usr/src/app/anti-fraud-microservice

# install dependencies
COPY package.json bun.lockb ./
RUN bun install

# copy all project files into the image
COPY . .

# run the app
USER bun