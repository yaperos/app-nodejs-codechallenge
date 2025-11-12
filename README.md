
### Installation & Setup

1. **Clone and install dependencies:**
```bash
git clone https://github.com/carloshuayamares/app-nodejs-codechallenge.git
cd app-nodejs-codechallenge
npm install
```

2. **Set up environment:**
```bash
cp .env.example .env
# Edit .env if needed (defaults should work)
```

3. **Start the application and services:**
```bash
npm run build
npm run docker:up
```
  - **Script Pre-Population**: In the deployment of docker compose, an initial query is executed to create the transaction types and transaction states.

### Important Information (Script Pre-Population)
```bash
  // Description of the possible values ​​for: transferTypeId
  [
    { id: 1, name: 'Transfer' },
    { id: 2, name: 'Payment' },
    { id: 3, name: 'Withdrawal' },
  ];

  // Description of the possible values ​​for: transactionStatus
  [
    { id: 1, name: 'Pending' },
    { id: 2, name: 'Approved' },
    { id: 3, name: 'Rejected' },
  ];
```
The application will be available at:
- **GraphQL Playground**: http://localhost:3000/graphql
- **Kafka UI**: http://localhost:8080

### Examples via GraphQL Playground:

#### 1. Create a Transaction 

**GraphQL Mutation:** 
```graphql
mutation {
  createTransaction(input: {
    accountExternalIdDebit: "uuid-debit-code-generate"
    accountExternalIdCredit: "uuid-credit-code-generate"
    tranferTypeId: 1
    value: 999
  }) {
    transactionExternalId
    transactionType {
      name
    }
    transactionStatus {
      name
    }
    value
    createdAt
  }
}
```

**Expected Response:**
```json
{
  "data": {
    "createTransaction": {
      "transactionExternalId": "generated-uuid",
      "transactionType": {
        "name": "Transfer"
      },
      "transactionStatus": {
        "name": "Pending"
      },
      "value": 999,
      "createdAt": "2026-01-01T00:00:00.000Z"
    }
  }
}
```

#### 2. Retrieve a Transaction

**GraphQL Query:**
```graphql
query {
  getTransaction(transactionExternalId: "uuid-of-create-transaction") {
    transactionExternalId
    transactionType {
      name
    }
    transactionStatus {
      name
    }
    value
    createdAt
  }
}
```
**Expected Response:**
```json
{
  "data": {
    "getTransaction": {
      "transactionExternalId": "generated-uuid",
      "transactionType": {
        "name": "Transfer"
      },
      "transactionStatus": {
        "name": "Approved"
      },
      "value": 999,
      "createdAt": "2026-01-01T00:00:00.000Z"
    }
  }
}
```