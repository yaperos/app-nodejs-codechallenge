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
docker-compose up
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

- test: 
```bash
npm run test
```
![alt text](https://raw.githubusercontent.com/yaperos/app-nodejs-codechallenge/454160949fbe268ca493f96089ff2db91929a78b/imgs/console.png)

![alt text](https://raw.githubusercontent.com/yaperos/app-nodejs-codechallenge/454160949fbe268ca493f96089ff2db91929a78b/imgs/postman.png)