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

## Workflow

In order to create and get a transaction:

1. Import in your postman workspace `./docs/Transactions.postman_collection.json`
2. Run `createTransaction` which is in *Create Transaction* on the imported collection. This mutation will start transaction creation. It will retrive the task and some useful information.
3. Copy `data.createTransaction.id` and set it in `transactionTask` which is in *Query Transaction* and run it then. As long polling pattern, you will receive the task with three important properties:
   - status: Task status (pending, completed).
   - retryAfter: Time in seconds to retry if the task has not ended.
   - retryTimes: Retry times before considering the task as not found.
   - result: The result of the task when it be completed. The completed transaction in this case.

You can check the stack and the process here:

![image](https://github.com/sjardon/app-nodejs-codechallenge/assets/71879650/5c499ac4-75c9-4c21-b2d2-89d28b389b92)

## Disclaimers

Some important developments are pendings:

1. Handle microservices errors
2. Master-slave pattern on Postgres

Some other development details could be missing due to lack of time.

Thanks for your time!
