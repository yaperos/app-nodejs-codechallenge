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
## Endpoints

## Running the apps

### Login request

```http request
POST http://localhost:8080/auth/login
Content-Type: application/json

{
	"username": "yape",
	"password": "123456"
}
```

### Login response

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InlhcGUiLCJzdWIiOiI5YmM2YjRjYS01NDI5LTRlOGEtYmE0Zi1jMzU2Yzk2YTNlZDgiLCJpYXQiOjE2NzUzNjA3OTEsImV4cCI6MTY3NTM2NDM5MX0.AzZ9j0V7I0l8d_Y4E2Kk5OVazijehJKRFK4-Oj_GKVU"
}
```

### Transaction create response

```http request
POST http://localhost:8080/tx
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InlhcGUiLCJzdWIiOiI5YmM2YjRjYS01NDI5LTRlOGEtYmE0Zi1jMzU2Yzk2YTNlZDgiLCJpYXQiOjE2NzUzNjA3OTEsImV4cCI6MTY3NTM2NDM5MX0.AzZ9j0V7I0l8d_Y4E2Kk5OVazijehJKRFK4-Oj_GKVU 

{
  "accountExternalIdDebit": "1a0f4d5d-dd59-40e7-bf36-4743e051808c",
  "accountExternalIdCredit": "9bc6b4ca-5429-4e8a-ba4f-c356c96a3ed8",
  "transferTypeId": 1,
  "value": 1000
}
```

### Transaction create response

```json
{
  "id": "78e3809d-e4b4-45ff-9337-9fbc9c1cbd4d"
}
```

### Transaction retrieve response

```http request
GET http://localhost:8080/tx/78e3809d-e4b4-45ff-9337-9fbc9c1cbd4d
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InlhcGUiLCJzdWIiOiI5YmM2YjRjYS01NDI5LTRlOGEtYmE0Zi1jMzU2Yzk2YTNlZDgiLCJpYXQiOjE2NzUzNjA3OTEsImV4cCI6MTY3NTM2NDM5MX0.AzZ9j0V7I0l8d_Y4E2Kk5OVazijehJKRFK4-Oj_GKVU 


```

### Transaction create response

```json
{
  "transactionExternalId": "78e3809d-e4b4-45ff-9337-9fbc9c1cbd4d",
  "transactionType": {
    "id": 1,
    "name": "SEND"
  },
  "transactionStatus": {
    "id": 2,
    "name": "APPROVED"
  },
  "value": 1000,
  "createdAt": "2023-02-02T17:57:48.175Z"
}
```

## Dev

- Author - [Daniel Roncal](www.linkedin.com/in/daniel-roncal-mattos)
