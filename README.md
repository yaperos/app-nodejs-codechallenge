# Yape challenge

Yape challenge repository. I hope you enjoy this code review!

## Introducción

Tech stack:

1. GraphQl API for incoming requests.
2. NodeJs with NestJs framework for microservices.
3. Postgress DB.
4. Redis DB.
5. Docker and Docker Compose.
6. Turborepo as monorepo tool.

## Local stack deployment

1. Run in root folder and each service folder: `cp .env.example .env`.
2. You can configure environment variables in each `.env` if is needed. Please, don't modify `APP_ENV=local` value.
3. Run `docker compose up`
4. Run `npm install`
5. Run `npm run start:prod`
