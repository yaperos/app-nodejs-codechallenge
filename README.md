## Project Specifications

**Environment**  

- Node: 14.16.0
- Sqlite: 3
- Docker: 14.13
- Default Ports: 3001 and 3002
- Configs in .env

**Command to root project**
- composer: 
```bash
docker-compose up -d
```

**Commands to each project**
- install: 
```bash
npm install
```
- setup: 
```bash
npm run db:setup
```
- run server: 
```bash
npm run dev
```
- or restart all db: 
```bash
npm run db:reset
```

- test Note: run the test with microservices stopped: 
```bash
npm run test
```
**Endpoints microservice transaction**
- create transaction: 
```bash
http://127.0.0.1:3001/transactions
```
- get transaction: 
```bash
http://127.0.0.1:3001/transactions/14903f2d-0759-412c-aea3-758ef6c170c6
```

**Img console test services**
![alt text](https://raw.githubusercontent.com/DanteCuevas/yape-app-nodejs-codechallenge/challenge-code/imgs/console.png)

**Img test postman**
![alt text](https://raw.githubusercontent.com/DanteCuevas/yape-app-nodejs-codechallenge/challenge-code/imgs/postman.png)
**Img test jest microservice transaction**
![alt text](https://raw.githubusercontent.com/DanteCuevas/yape-app-nodejs-codechallenge/challenge-code/imgs/jest.png)

**Curl commands and img response kafka**
- post transaction value less than 1000: 
```bash
curl -X POST -H "Content-Type: application/json" -d '{"accountExternalIdDebit":"d54a623d-e1eb-4e1f-80c1-3c770c004721", "accountExternalIdCredit":"d54a623d-e1eb-4e1f-80c1-3c770c004723", "tranferTypeId":1, "value":900}' http://127.0.0.1:3001/transactions
```
- post transaction value grater than 1000: 
```bash
curl -X POST -H "Content-Type: application/json" -d '{"accountExternalIdDebit":"d54a623d-e1eb-4e1f-80c1-3c770c004721", "accountExternalIdCredit":"d54a623d-e1eb-4e1f-80c1-3c770c004723", "tranferTypeId":1, "value":1100}' http://127.0.0.1:3001/transactions
```
- get transaction: 
```bash
curl -X GET -H "Content-Type: application/json" http://127.0.0.1:3001/transactions/74bf850b-be12-46ad-85e2-5d28c6a555a8
```

![alt text](https://raw.githubusercontent.com/DanteCuevas/yape-app-nodejs-codechallenge/challenge-code/imgs/curl-and-response-kafka.png)