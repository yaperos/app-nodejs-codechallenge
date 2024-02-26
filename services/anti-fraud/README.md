# Anti-fraud Service

Service for evaluating transactions created from Transaction service.
Uses KafkaJS to consume transaction-created events from `event-created` topic and produce transaction-evaluated events to `event-evaluated` topic.

## Steps to run app

1. Execute the following command

```
npm run start:dev
```

## Stack

- Node
- KafkaJS
