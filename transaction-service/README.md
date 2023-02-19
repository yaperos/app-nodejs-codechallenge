# Transaction Service

1. Clone the `.env.example` file and rename to `.env`. Then change the variable values if neccessary.
2. Start a new query console with postgres. Run the _sql scripts_ in `migrations` folder.
3. Exec `npm run install` for install dependencies.
4. Exec `npm run dev` for development.
5. Exec `npm run build` and then `npm run start` for production.
6. Exec `npm run lint` to apply linter.

## Services

### Create transaction

```mermaid
sequenceDiagram
    [Infraestructure] Request->>+[Infraestructure] CreateTransaction: request
    [Infraestructure] CreateTransaction->>+[Domain] TransactionService: create({ ... })
    [Domain] TransactionService->>+[Domain] TransactionRepository: create({ ... })
    [Domain] TransactionRepository->>-[Domain] TransactionService: transaction
    [Domain] TransactionService->>+[Domain] TransactionCreatedEvent: dispatch
    [Domain] TransactionCreatedEvent->>+[Domain] ProccessTransactionCreated: handle(...)
    [Domain] TransactionCreatedEvent->>-[Domain] TransactionService: void
    [Domain] TransactionService->>-[Infraestructure] CreateTransaction: transaction
    [Domain] ProccessTransactionCreated->>-[Domain] PublisherSubscribeService: emit(message)
    [Infraestructure] CreateTransaction->>-[Infraestructure] Resource: response
```

### Handle transaction validated from anti-fraud service

```mermaid
sequenceDiagram
   Kafka-->>+[Domain] PublisherSubscriberService: consume(message)
   [Domain] PublisherSubscriberService-->>+[Domain] TransactionValidated: new(transactionId, status)
   [Domain] TransactionValidated-->>+[Domain] UpdateValidatedTransaction: handle(event)
   [Domain] UpdateValidatedTransaction-->>+[Domain] TransactionService: updateStatus(transactionId, status)
   [Domain] TransactionService-->>+[Domain] TransactionRepository: updateStatus(transactionId, status)
   [Domain] TransactionRepository->>-[Domain] TransactionService: void
   [Domain] TransactionService->>-[Domain] UpdateValidatedTransaction: void
   [Domain] UpdateValidatedTransaction->>-[Domain] TransactionValidated: void
   [Domain] TransactionValidated->>-[Domain] PublisherSubscriberService: void
   [Domain] PublisherSubscriberService-->>-[Domain] PublisherSubscriberService: destruct
```

### Retrieve transaction

```mermaid
sequenceDiagram
[Infraestructure] Request->>+[Infraestructure] GetTransaction: request
[Infraestructure] GetTransaction->>+[Domain] TransactionService: getById(transactionId)
[Domain] TransactionService->>+[Domain] TransactionRepository: getById(transactionId)
[Domain] TransactionRepository->>-[Domain] TransactionService: transaction
[Domain] TransactionService->>-[Infraestructure] GetTransaction: transaction
[Infraestructure] GetTransaction->>-[Infraestructure] Resource: response
```
