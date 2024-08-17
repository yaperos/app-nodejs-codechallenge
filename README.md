# Yape CodeChallenge
### Challenge Using Following Technologies:
- NestJS
- Typescript
- Kafka
- Kafka UI
- Postgres
- Docker
- DockerHub
- Dockerfile
- CI/CD
- Swagger


## Docker Hub

## Images Docker Hub

- **ms-transaction**: [Docker Hub - ms-transaction](https://hub.docker.com/r/rafamandevops/ms-transaction)
- **ms-antifraud**: [Docker Hub - ms-antifraud](https://hub.docker.com/r/rafamandevops/ms-antifraud)

# API Documentation
## Ms Transaction

### Show API Swagger Documentation

```
GET /docs
```

### Create Transaction
```
POST /transactions
```
```
{
  "accountExternalIdDebit": "{{$guid}}",
  "accountExternalIdCredit": "{{$guid}}",
  "tranferTypeId": 1,
  "value": {{randomFloatValue}}
}
```


### Get Transaction
```
GET /transactions/c9e286f7-0d78-4d16-8e21-a720324b1f50
```
```
{
  "transactionExternalId": "c9e286f7-0d78-4d16-8e21-a720324b1f50",
  "transactionType": {
    "name": 1
  },
  "transactionStatus": {
    "name": "APPROVED"
  },
  "value": 298.26,
  "createdAt": "2024-08-17T02:22:06.182Z"
}
```
