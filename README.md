# Documentation

## Definition

It's required to create a microservices application that validates the transaction amount. A transaction is valid if the amount is less than or equal to 1000. A greater amount invalidates the transaction.
Due to the nature of the business, the response time to a query about the status of a transaction is required to be as short as possible.

## Diagrams C4 Model

### Context

![Diagram context](images/general1.png "Diagram Context")

### Containers

![Diagram container](images/general2.png "Diagram Container")

### Containers: Transaction Microservice

![Diagram container](images/transaction-relations.png "Diagram Container")

### Components: Transaction Microservice

![Diagram component](images/transaction-arquitect.png "Diagram Component")

### Containers: Anti-fraud Microservice

![Diagram container](images/antifraud.png "Diagram Container")

## Sequence diagram

![Sequence diagram](images/diagram-sec.png "Sequence diagram")

## Pre-requisites

- NodeJS (version 18)
- Docker Desktop (version 4.23)
- Any terminal

## Install dependencies

- Execute "npm install" from the directory "anti-fraud"
- Execute "npm install" from the directory "transaction"

## Run containers

- Execute "docker compose up -d mysql-server mysql-client mongo-server mongo-client kafka kafka_ui jaeger" from the directory root

## Execute microservices (local)

- Rename file ".env-sample" to ".env" in the directories "anti-fraud" and "transaction"
- Execute "npm run start:dev" from the directory called "transaction"
- Execute "npm run start:dev" from the directory called "anti-fraud"

## Endpoints (local)

- You can find a postman's collection in the directory called "postman". In that collection, you're going to find a directory named "local" to execute a request to create a transaction and also to execute a request to get status's transaction.

## Execute microservice (containers)

- Rename file ".env-sample" to ".env" in the directories "anti-fraud" and "transaction"
- Execute "docker compose up -d mysql-server mysql-client mongo-server mongo-client kafka kafka_ui jaeger transaction anti-fraud" from the directory root

## Endpoints (container)

- You can find a postman's collection in the directory called "postman". In that collection, you're going to find a directory named "container" to execute a request to create a transaction and also to execute a request to get status's transaction.

## Swagger

- http://localhost:3000/api

## Playground GraphQL

- http://localhost:3000/graphql

## Dashboards

- Kafka: http://localhost:8080
- MySQL: http://localhost:8082
- MongoDB: http://localhost:8081
  _you can find the credentials in file "compose.yaml"_

## Monitoring apps

- Both microservices have implemented opentelemetry and the data is send to Jaeger.
- Watch the data in the url "http://localhost:16686"

## Testing

- Execute "npm test" in the directories "anti-fraud" and "transaction"
- Check the results in the directory "reports". There you can find the files "test.v1.html" and "test.v2.html".
- Check the coverage in the directory "coverage". There you can find the file "index.html"

## Quality Code

- Stop "docker compose" and execute "docker compose up -d sonarqube"
- Open the url "http://localhost:9000" in a browser
- Create a project and get the security token.
- Update the file "sonar-project.js" located in the directories "anti-fraud" and "transaction". Update the fields: sonar.projectKey, sonar.projectName and sonar.token
- Execute "npm run sonar" in the directories "anti-fraud" and "transaction"

## Notes

- Both projects have implemented clean architect (onion architect + hexagonal architect) and Domain Design Driven (DDD)
- Both projects use clean code
- Both projects have implemented their Dockerfile optimized
- Both projects have implemented ESLint
- I've implemented two databases:
  - The first one is MySQL to save all transactions (writes)
  - The second one is MongoDB. It's optimized to requests about status of any transaction (reads)
- The project "transaction" implements API Rest (writes) and API GraphQL (reads)

## Future improvements

- "Infrastructure as code" can improve the deployment times towards the clouds. I recommend to evaluate "Pulumi".
- Implement Kubernetes' manifests:
  - Pods, Services, Secrets, ConfigMaps, Deployments: Transaction, Anti-Fraud, Database clients, Kafka UI and Sonarqube.
  - Namespaces, Probes.
  - Statefulset: Kafka, MongoDB, MySQL
