# Yape Code Challenge :rocket:

Our code challenge will let you marvel us with your Jedi coding skills :smile:. 

Don't forget that the proper way to submit your work is to fork the repo and create a PR :wink: ... have fun !!

- [Problem](#problem)
- [Tech Stack](#tech_stack)
- [Send us your challenge](#send_us_your_challenge)

# Problem

Every time a financial transaction is created it must be validated by our anti-fraud microservice and then the same service sends a message back to update the transaction status.
For now, we have only three transaction statuses:

<ol>
  <li>pending</li>
  <li>approved</li>
  <li>rejected</li>  
</ol>

Every transaction with a value greater than 1000 should be rejected.

```mermaid
  flowchart LR
    Transaction -- Save Transaction with pending Status --> transactionDatabase[(Database)]
    Transaction --Send transaction Created event--> Anti-Fraud
    Anti-Fraud -- Send transaction Status Approved event--> Transaction
    Anti-Fraud -- Send transaction Status Rejected event--> Transaction
    Transaction -- Update transaction Status event--> transactionDatabase[(Database)]
```

# Tech Stack

<ol>
  <li>Node. You can use any framework you want (i.e. Nestjs with an ORM like TypeOrm or Prisma) </li>
  <li>Any database</li>
  <li>Kafka</li>    
</ol>

We do provide a `Dockerfile` to help you get started with a dev environment.

You must have two resources:

1. Resource to create a transaction that must containt:

```json
{
  "accountExternalIdDebit": "Guid",
  "accountExternalIdCredit": "Guid",
  "tranferTypeId": 1,
  "value": 120
}
```

2. Resource to retrieve a transaction

```json
{
  "transactionExternalId": "Guid",
  "transactionType": {
    "name": ""
  },
  "transactionStatus": {
    "name": ""
  },
  "value": 120,
  "createdAt": "Date"
}
```

## Optional

You can use any approach to store transaction data but you should consider that we may deal with high volume scenarios where we have a huge amount of writes and reads for the same data at the same time. How would you tackle this requirement?

You can use Graphql;

# Send us your challenge

When you finish your challenge, after forking a repository, you **must** open a pull request to our repository. There are no limitations to the implementation, you can follow the programming paradigm, modularization, and style that you feel is the most appropriate solution.

If you have any questions, please let us know.

# Run Project

- Create a local database in PostgreSQL (DB connection params should be match with project environment file)
- Place in project root folder with cmd or bash and execute <code>yarn install</code>
- Replace data configuration in PostgreSQL DataSource <code>src/infra/db/data-source.ts</code> 
- Execute <code>yarn build</code>
- Execute <code>migration:run</code> script in package.json file
- In project root folder, please rename the file <code>.env_example</code> to <code>.env</code> and adjust the DB connection vars:

```
# Environment
NODE_ENV=

# PORT
PORT=

#TYPEORM
TYPEORM_HOST=
TYPEORM_PORT=
TYPEORM_DATABASE=
TYPEORM_USERNAME=
TYPEORM_PASSWORD=

## KEYCLOAK
KC_SERVER=https:
KC_CLIENT=
KC_CLIENT_SECRET=
KC_REALM=
```
- You can find a Postmant Collection and Postman environment in folder <code>/docs</code> Please import this files in you postman to consume all API Endpoints.
- Check the <code>Swagger Documentation</code> of API in http://localhost:3000/docs/


## Run Unit Tests

You can run unit tests executing the follow command <code>npm run test</code>. you should see a resume of code coverage in console screen.
