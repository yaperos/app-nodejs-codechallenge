# Yape Code Challenge

## Financial Transactions Service

The Financial Transactions Service is a microservice responsible for handling financial transactions and related operations.

### Features

Create, retrieve, and update financial transactions.
Perform validations and checks on transactions.
Process transactions asynchronously and handle events.

### Getting Started

Clone the repository:

```
git clone https://github.com/alexandersotoc/app-nodejs-codechallenge
```

Install dependencies:

```
cd financial-transactions-service
npm install
```

### Configuration

Configure the environment variables required for the service. See the .env.example file for reference.

Modify the configuration files according to your environment and service requirements.

Usage
Start the service:

```
npm run start:dev
```

The service will be accessible at http://localhost:3000. Make sure to replace port with the appropriate port number.

### API Endpoints

The Financial Transactions Service exposes the following API endpoints:

- POST /financial-transactions: Create a new financial transaction.
- GET /financial-transactions/:id: Retrieve a specific transaction by ID.

### Events

The Antifraud Service emits for the following events:

- TransactionCreated: Emitted when a new transaction is created.

The Antifraud Service listens for the following events:

- TransactionApproved: Emitted when a transaction is updated.
- TransactionRejected: Emitted when a transaction is rejected.

## Antifraud Service

The Antifraud Service is a microservice responsible for fraud detection and prevention in financial transactions.

### Features

Analyze transactions for potential fraudulent activities.
Implement antifraud algorithms and rules.
Communicate with the Financial Transactions Service for transaction data.

### Getting Started

Clone the repository:

```
git clone https://github.com/alexandersotoc/app-nodejs-codechallenge
```

Install dependencies:

```
cd antifraud-service
npm install
```

### Configuration

Configure the environment variables required for the service. See the .env.example file for reference.

Modify the configuration files according to your environment and service requirements.

### Usage

Start the service:

```
npm run start:dev
```

The service will be accessible at http://localhost:3001. Make sure to replace the port with the appropriate port number.

### Events

The Antifraud Service listens for the following events:

- TransactionCreated: Emitted when a new transaction is created.

The Antifraud Service emits for the following events:

- TransactionApproved: Emitted when a transaction is updated.
- TransactionRejected: Emitted when a transaction is rejected.
