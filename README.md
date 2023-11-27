# Yape Code Challenge

## Instructions

1. Start Docker compose file

```bash
docker-compose up
```

2. Install dependencies

```bash
npm install
```

3. Start the app

```bash
npm run start
```

4. Please insert data to the following tables:

`transaction_type`

```sql
INSERT INTO transaction_type
  ( id, name )
VALUES
  (1, 'Transacción inmediata'),
  (2, 'Transacción diferida');
```

`transaction_status`

```sql
INSERT INTO transaction_status
  ( id, name )
VALUES
  (1, 'pending'),
  (2, 'approved'),
  (3, 'rejected');
```

5. Open the [documentation](http://localhost:3000/graphql)

## Testing

### Kafka(local)

1. Send a message to the `antifraud-evaluation` topic to simulate the application's behavior when it receives the result from the anti-fraud system.

```bash
echo "{\"transactionId\":\"[uuid]\",\"result\":\"approved\"}" | ./kafka-console-producer.sh --broker-list localhost:9092 --topic antifraud-evaluation
```

2. Subscribe to the `transaction-created` topic to receive notifications when a transaction is created by the application

```bash
./kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic transaction-created --from-beginning
```
