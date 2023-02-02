# Project Specifications

# Environment

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

**Commands to each project**
- go to project: 
```bash
cd apps/{project_name}
```
- run server:
```bash
npx nx serve
```

**Endpoints microservice transaction**
- create transaction: 
```bash
http://127.0.0.1:3333/api/transactions
```
- get transaction: 
```bash
http://127.0.0.1:3333/api/transactions/14903f2d-0759-412c-aea3-758ef6c170c6
```