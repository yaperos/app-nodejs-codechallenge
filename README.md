# Yape Code Challenge :rocket:

# Technological stack
  The challenge was solved using Nest.js framework with microservices. The transaction was built using hexagonal architecture and cqrs for scalability issues. The anti-fraud microservice also uses nest.js.

# Prerequisites
  Check that you have this installed on your system:
  1. Node.js (^18)
  2. Docker 

# Setup
  1. Go to root directory and run `docker compose up` command to start containers.
  2. In directory `antifraud` use `npm install` or `yarn install` to install dependencies.
  3. In directory `transaction` use `npm install` or `yarn install` to install dependencies.
  4. In directory `transaction` create .env file with the following variables.
    
  ```
  SERVER_PORT=3000
  MYSQL_HOST=localhost
  MYSQL_PORT=3306
  MYSQL_USERNAME=user
  MYSQL_PASSWORD=password123
  MYSQL_DATABASE=transactions
  ```

  5. Run both using `npm run start:dev` or `yarn start:dev`.

# Usage 

  First let's make a transaction, the target route is `http://localhost:3000`: 

    1. Open an API platform  like Postman, Insomnia, etc. 
    2. Configure the request with the endpoint ` http://localhost:3000/transactions `, method POST. 
    3. In request body use raw, and content-type JSON.
    4. Use this JSON object (example):
      
  ```
  {
    "accountExternalIdDebit": "444a-222b-33g3-63ac",
    "accountExternalIdCredit": "44a-222b-33g3-63ac",
    "transferTypeId": 1,
    "value": 230
  }
  ```
    5. Send the request and see the response, if all is ok you see object response with the `transactionExternalId`,
        we will use it later for the get query. The response should be something like this:

  ```
  {
    "transactionExternalId": "7a4e04cd-0724-490e-9e2b-65f24bf39b62",
    "accountExternalIdDebit": "444a-222b-33g3-63ac",
    "accountExternalIdCredit": "44a-222b-33g3-63ac",
    "value": 230,
    "status": 1
  }
  ```
  Now we check the status of the transaction in DB, for that, we use the following steps:

    1. Configure the request with the endpoint ` http://localhost:3000/transactions/{transactionExternalId} `, method GET.
    2. Send Request, for this part just ensure that the `transactionExternalId` is correct. 

  Finally we can see the object response of the transaction with the status resolved. 

  ```
    {
      "transactionExternalId": "7a4e04cd-0724-490e-9e2b-65f24bf39b62",
      "transactionType": {
        "name": 1
      },
      "transactionStatus": {
        "name": "Approved"
      },
      "value": 230,
      "createdAt": "2024-01-19T22:04:44.922Z"
    }
  ```


    
       