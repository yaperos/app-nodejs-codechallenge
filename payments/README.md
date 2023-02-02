# Project Specifications

## Environment

- Node: 18.12.1
- Docker: 20.10.22
- Default Ports: 3001 and 3002
- Projects config in .local.env

**Command to root project**

- composer: 
```bash
docker-compose up -d
```
- go to repository: 
```bash
cd payments/
```
- install in repository: 
```bash
npm install
```
- migrate database schema (tables):
```bash
npx nx run transaction-microservice:run-migration
```
![DB Migration](https://i.postimg.cc/GhPcHXhf/01-migration.png)

- seeding initial data:
```bash
npx nx run transaction-microservice:run-seed
```
![DB Seeding](https://i.postimg.cc/SxDkGj97/02-seeding.png)

**Commands to each project**

- go to project: 
```bash
cd apps/{project_name}
```
- run server:
```bash
npx nx serve
```
***Test***

- Start Api gateway
![Start Api gateway](https://i.postimg.cc/HLnHvH4G/03-start-api-gateway.png)

- Start Transaction microservice
![Start Transaction microservice](https://i.postimg.cc/cH8WZmbX/04-start-transaction-microservice.png)

- Start Antifraud microservice
![Start Antifraud microservice](https://i.postimg.cc/dtFFPGmj/05-start-antifraud-microservice.png)


**Endpoints microservice transaction**
- create transaction: 
```bash
http://127.0.0.1:3333/api/transactions
```
- get transaction: 
```bash
http://127.0.0.1:3333/api/transactions/14903f2d-0759-412c-aea3-758ef6c170c6
```

***Test***

- Post Transaction - Less 1000
![Post Transaction - Less 1000](https://i.postimg.cc/5ydVtzc1/06-post-transaction-less-1000.png)

- Get Transaction - Less 1000 - Approved
![Get Transaction - Less 1000](https://i.postimg.cc/NGmtzdT0/07-get-transaction-less-1000-approved.png)

- Post Transaction - Greater 1000
![Post Transaction - Greater 1000](https://i.postimg.cc/2yQfL5mW/08-post-transaction-greater-1000.png)

- Get Transaction - Greater 1000 - Rejected
![Get Transaction - Greater 1000 - Rejected](https://i.postimg.cc/Pq7HBc2C/09-get-transaction-greater-1000-rejected.png)