# transactions microservice
This is the transactions microservice.

The database structure is the following:


```mermaid
erDiagram
    User ||--o{ Balance : "has many"
    User {
        string userId PK
        DateTime createdAt
        DateTime updatedAt
        string email UNIQUE
        string name
    }

    Balance ||--o{ Transaction : "debitTransactions"
    Balance ||--o{ Transaction : "creditTransactions"
    Balance ||--o{ BalanceSnapshot : "has many"
    Balance {
        string balanceId PK
        string userId FK
        DateTime createdAt
        DateTime deletedAt
        DateTime updatedAt
    }

    BalanceSnapshot {
        string snapshotID PK
        Decimal amount
        DateTime from
        DateTime to
        string balanceID FK
    }

    Transaction ||--o{ TransactionStatus : "has many"
    Transaction }|--o{ Balance : "debit"
    Transaction }|--o{ Balance : "credit"
    Transaction }|--o{ BalanceSnapshot : "balanceSnapshot"
    Transaction }|--o{ TransactionType : "transactionType"
    Transaction {
        string transactionId PK
        Decimal amount
        string account_id_debit FK
        string account_id_credit FK
        string external_account_id_debit
        string external_account_id_credit
        DateTime createdAt
        DateTime deletedAt
        string snapshotId FK
        string transactionTypeId FK
    }

    TransactionType ||--o{ Transaction : "has many"
    TransactionType {
        string transactionTypeId PK
        string name
        DateTime createdAt
        DateTime deletedAt
    }

    TransactionStatus }|--|| Transaction : "transaction"
    TransactionStatus }|--|| StatusTransaction : "statusTransaction"
    TransactionStatus {
        string TransactionStatusId PK
        DateTime from
        DateTime To
        string transactionId FK
        string statusTransactionId FK
    }

    StatusTransaction ||--o{ TransactionStatus : "has many"
    StatusTransaction {
        string StatusTransactionId PK
        string name
        string description
        DateTime createdAt
        DateTime deletedAt
    }

```