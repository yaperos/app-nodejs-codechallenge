
# Yape Code Challenge 🚀

Follow the next steps for test locally the project, you could use visual studio code, and import the curls with postman.


## Run Locally

Clone the project

```bash
  git clone https://github.com/migelbaez/app-nodejs-codechallenge.git
```

Go to the project directory

```bash
  cd api-transaction
```

Install Docker Images

```bash
  docker-compose up
```

Install dependencies

```bash
  npm install
```

Create DataBase

```bash
  nest build -c nest-cli.migrations.json
  npx typeorm migration:run -d dist/out/apps/api-transaction/src/typeorm-cli.config
```

Start api-transaction

```bash
  nest start
```

Start ms-transaction

```bash
  nest start ms-transaction
```

Start ms-anti-fraud

```bash
  nest start ms-anti-fraud
```

Test Api Create Transaction

```bash
  curl --location 'http://localhost:3000/transaction' \
       --header 'Content-Type: application/json' \
       --data '{
               "accountExternalIdDebit": "80d9c31d-2068-44e5-a48f-4621545f6782",
               "accountExternalIdCredit": "0ff63a47-1275-436a-89fa-25d1a9d4bb11",
               "tranferTypeId": 1,
               "value": 10000
               }'

```

Test Api Get Transaction

```bash
  curl --location 'http://localhost:3000/transaction/2090a663-b6e7-4c60-b323-54ac442f2994'

```
## Authors

- [github@migelbaez](https://www.github.com/migelbaez)
- [linkedin@migelbaez](https://www.linkedin.com/in/miguel-b-aa530a225)

