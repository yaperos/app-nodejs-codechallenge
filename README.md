# Yape Code Challenge :rocket:
This Monoreporepository fulfills the yape code challenge requirements, and contains two microservices for validating finantial transactions. 
The complete tech Stack includes:
-  Node.js as the javascript execution environment with event-driven architecture.
-  NestJs as the main framework.
-  Hexagonal Architecture as the design pattern.
-  Typescript as the programming language (transpiled to javascript).
-  Kafka as the streamming messages provider.
-  MongoDB as the Non-relational database engine.
-  Mongoose as the Node.js ODM for MongoDB.
-  Docker && Docker compose for containerization.
  
## Contents
- [Getting started](#getting-started)

## About the requirement
Every time a financial transaction is created it must be validated by our anti-fraud microservice and then the same service sends a message back to update the transaction status. For now, we have only three transaction statuses:

pending
approved
rejected
Every transaction with a value greater than 1000 should be rejected.

