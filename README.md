# Yape Code Challenge :rocket:

- [Solution](#solution)
- [Tech Stack](#tech_stack)
- [Preview](#preview)
- [Install](#install)

# My Solution

For this challenge I have created two services.

The first one is in charge of receiving the transactions and verifies that the data is correct, likewise it is in charge of registering them in the database according to what the anti-fraud service returns.

The second service is in charge of validating that the data is not suspect and more conditions in charge of the business model, in this case that it is not greater than 1000. When this occurs, it returns an object with the 'valid' attribute and accordingly the Transaction service can record the approved or rejected status.

# Tech Stack

KafDrop, Kafka, PostGreSQL, TypeORM and NestJs with TypeScript

# Preview
**Img test microservice transaction with valid false**
![alt text](https://i.ibb.co/pvLRxqf/imagen.png)

**Img test microservice transaction with valid true**
![alt text](https://i.ibb.co/CQR4fsk/imagen.png)

# Install

-npm install (all proyects)
-docker-compose up
-execute sql.init in pgadmin (transaction folder)
-npm run start:dev (all proyects)
