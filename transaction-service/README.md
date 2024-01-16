# Transaction Service

This project is set up to use TypeScript, ESLint (following Airbnb's style rules), Prettier for code formatting, and `nyc` for code coverage.

## Development Environment Setup

### Prerequisites

- Node.js (recommended version: 14.x or higher)
- npm (comes with Node.js)

# Running the Application Locally

- cd /opt/kafka_2.12-3.6.1 (or local kafka version)
- init zookeper => sudo bin/zookeeper-server-start.sh config/zookeeper.properties
- sudo bin/kafka-server-start.sh config/server.properties
- sudo bin/kafka-topics.sh --create --topic transactions --bootstrap-server localhost:9092 --replication-factor 1 --partitions 1
- sudo bin/kafka-topics.sh --create --topic transactions_anti_fraud --bootstrap-server localhost:9092 --replication-factor 1 --partitions 1
- npm run start:dev

# Test topics (create and read)

sudo bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic transactions --from-beginning
sudo bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic transactions_anti_fraud --from-beginning

send a mesage with kafka =>

sudo bin/kafka-console-producer.sh --broker-list localhost:9092 --topic transactions
sudo bin/kafka-console-producer.sh --broker-list localhost:9092 --topic transactions_anti_fraud

# DB

npx prisma generate --schema=./prisma/postgres-schema.prisma
npx prisma migrate dev --name init --schema=./prisma/postgres-schema.prisma
npm run seed

# Prettier

npx prettier --write .

# Running ESLint and Prettier on VS Code Save

{
"editor.codeActionsOnSave": {
"source.fixAll.eslint": true
},
"eslint.validate": ["javascript", "javascriptreact", "typescript", "typescriptreact"]
}

# Testing and Code Coverage

npm test

# Code Coverage

npm run coverage

This will generate a coverage report in the terminal and also create a more detailed HTML report in the coverage directory.
