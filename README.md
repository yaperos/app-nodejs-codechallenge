# Yape Code Challenge :rocket:

This repo contains these microservices
- anti-fraud-microservice
- transaction-microservice

## How to run

### Prerequisites

- docker
- docker-compose
- [Bun 1.0.11](https://bun.sh/)
- WSL2 (If using windows)

### Setup environment

1. Clone this repo

```bash
git clone
```

2. Start background services using docker-compose (kafka, zookeeper, postgres)

```bash
docker-compose up -d
```

### Run anti-fraud-microservice 🦉

1. Install dependencies

```bash
cd anti-fraud-microservice
bun install
```

2. Start service

```bash
bun start
```

### Run transaction-microservice 🕊️

1. Install dependencies

```bash
cd transaction-microservice
bun install
```

2. Create .env and customize it

```bash
cp .env.example .env
```

3. Run migrations

```bash
bunx prisma migrate deploy
```

4. Run seeds

```bash
bunx prisma db seed
```

5. Start service

```bash
bun start
```

## Documentation

### Postman

The project also includes a Postman collection that can be used to test the API.

https://solar-space-772585.postman.co/workspace/yape~f65a099a-dccd-47d7-a786-3dad2e217b86/collection/15040281-d99df20a-d237-4bab-8448-3524c21b53bc?action=share&creator=15040281&active-environment=15040281-2a0c4158-b9a9-48b3-a48d-15e334ac939a

# Tech Stack

- [Bun](https://bun.sh/)
- [Elysia](https://elysiajs.com/)
- Prisma
- Kafka
- Postgres


## Q&A


#### Why is the project using Elysia?

Elysia is a backend framework that is built on top of the bun runtime. It provides a set of tools and conventions that make it easier to build backend applications.

#### Why is the project using the bun runtime?

Bun is designed as a drop-in replacement for Node.js

The bun runtime is a lightweight runtime that is optimized for building backend applications. It is also the recommended runtime for [Elysia](https://elysia.gitbook.io/docs/).

As stated in the [bun documentation](https://bunjs.dev/docs/introduction/what-is-bun),
Bun is a new JavaScript runtime built from scratch to serve the modern JavaScript ecosystem.

We also benefit from the performance boost that comes with using the bun runtime. (Read [Benchmark Node.js vs Deno vs Bun using Redis](https://medium.com/deno-the-complete-reference/node-js-vs-deno-vs-bun-who-works-fastest-with-redis-cache-485263e3d9cc))

#### Why does the project use the SRC Architecture?

The SRC Architecture is a proven architectural pattern that is used by many popular backend frameworks, such as [NestJS](https://nestjs.com/), [AdonisJS](https://adonisjs.com/), and [FeathersJS](https://feathersjs.com/). It is also the recommended architecture for [Elysia](https://elysia.gitbook.io/docs/).


This project was created using `bun init` in bun v1.0.11. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

## Service-Route-Controller (SRC) Architecture

### Description

The **Service-Route-Controller (SRC) Architecture** is an architectural pattern used for structuring backend applications. It provides a clear separation of responsibilities, making it easier to organize and maintain code. The architecture consists of three main components:

- **Service**: Responsible for handling business logic and interactions with databases or other data sources.
- **Route**: Defines API routes and endpoints to direct incoming HTTP requests to the appropriate controllers.
- **Controller**: Manages application logic and handles HTTP requests.

### Derived From

The SRC Architecture draws inspiration from the **Model-View-Controller (MVC)** pattern, adapting it to the context of backend development. While not a strict implementation of MVC, it embraces the principles of separation of concerns and modularity, facilitating the development of scalable and maintainable backend applications.
