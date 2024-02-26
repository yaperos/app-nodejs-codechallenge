# Transaction Service

Exposes a GraphQL API for creating and modifying transactions.
Use KafkaJS to produce events to `created-event` topic and consume evaluated events `evaluated-event` topic.

## Steps to run app

1. Create an .env file with the required variables. You can use the .env.sample as reference

2. Execute the following command to start the server:

   ```
   npm run start:dev
   ```

3. Seed the relations data by getting the following url: [http://localhost:3000/transactions/seed](http://localhost:3000/transactions/seed)

4. You can explore que available GraphQL schema on [http://localhost:3000/graphql](http://localhost:3000/graphql)

## Stack

- NestJS
- Apollo Server
- Postgres
