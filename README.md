## Introduction
The Yape Code Challenge Application is a Node.js application built with the NestJS framework. It is
designed to handle financial transactions, with features including transaction creation, retrieval,
automatic status updates, and listing all transactions. The application integrates with Kafka for
message handling and uses PostgreSQL as its database.

## Getting Started
### Prerequisites
- Node.js
- Docker and Docker Compose
- PostgreSQL
- Kafka

### Installation
1. **Clone the Repository**: Clone the project repository to your local machine.
 ```sh
 git clone https://github.com/leoquin26/app-nodejs-codechallenge.git
 ```
2. **Navigate to the Project Directory**:
 ```sh
 cd app-nodejs-codechallenge
 ```
3. **Install Dependencies**:
 ```sh
 npm install
 ```
4. **Start PostgreSQL and Kafka**:
 Using Docker Compose, start the PostgreSQL and Kafka services.
 ```sh
 docker-compose up -d
 ```
5. **Run Database Migrations**:
 ```sh
 npx prisma migrate dev
 ```
6. **Start the Application**:
 ```sh
 npm run start
 ```
## API Endpoints
### Create Transaction
- **Method**: POST
- **URL**: `/transactions`
- **Body**:

 ```json
 {
 "accountExternalIdDebit": "string",
 "accountExternalIdCredit": "string",
 "tranferTypeId": 1,
 "value": 120
 }
 ```

- **Description**: Creates a new transaction. Transactions with a value greater than 1000 are
automatically set to 'rejected'. Transactions with a value of 1000 or less are set to 'pending' and later
updated to 'approved' after 1 minute.

### Get Transaction
- **Method**: GET
- **URL**: `/transactions/:id`
- **Description**: Retrieves details of a specific transaction by its ID.
### Get All Transactions
- **Method**: GET
- **URL**: `/transactions`
- **Description**: Retrieves a list of all transactions.

## How the Application Works
- **Transaction Handling**: When a transaction is created, it is saved to the database with an initial
status. If the transaction amount is over 1000, it is immediately marked as 'rejected'. Otherwise, it is
marked as 'pending' and automatically updated to 'approved' after 1 minute using a scheduled task.
 
- **Kafka Integration**: The application integrates with Kafka, which can be used for message
passing between different services (e.g., for anti-fraud checks).
- **Scheduled Task**: A background task runs periodically to update the status of pending
transactions that meet specific criteria.