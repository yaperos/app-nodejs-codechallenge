<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Run docker-compose

```bash
# development
$ docker-compose run
```

## Create database and add .env file with this setting

```bash
# development
TYPEORM_HOST=localhost
TYPEORM_PORT=5432
TYPEORM_USERNAME=postgres
TYPEORM_PASSWORD=postgres
TYPEORM_DATABASE=yape
TYPEORM_SYNCHRONIZE=false

JWT_SECRET=devY@pe
```

## Execute initials scripts of database

```bash
# development
$ npm run migrations:run
```

## Running the apps

```bash
# gateway Rest API
$ nest start

# transaction TCP API
$ nest start yape-transaction

# anti-fraud KAFKA API
$ nest start yape-anti-fraud

# auth TCP API
$ nest start yape-auth
```


## Dev

- Author - [Daniel Roncal](www.linkedin.com/in/daniel-roncal-mattos)
