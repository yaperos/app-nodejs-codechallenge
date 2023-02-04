#!/bin/sh

# shellcheck disable=SC2164
cd yape
docker-compose up -d
yarn bootstrap
yarn prisma generate
yarn prisma migrate dev
yarn start
yarn start anti-fraud
