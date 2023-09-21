'use strict';

const express = require('express');
const { Client } = require("pg");
const fs = require('fs');
const { Kafka } = require('kafkajs');

// Constants
const PORT = 6969;
const HOST = '0.0.0.0';

// DB Setup
const client = new Client({
  password: "postgres",
  user: "postgres",
  host: "postgres",
});

// Kafka Setup
const kafka = new Kafka({
  clientId: 'my-app',
  brokers: [ 'kafka:29092' ]
});
const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'test-group' });
(async () => {
  // Start the producer
  await producer.connect();

  // Start the consumer
  await consumer.connect();
  await consumer.subscribe({ topic: 'test-topic', fromBeginning: true });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        partition,
        offset: message.offset,
        value: message.value.toString(),
      });

      // When the consumer receives an event of a newly added transaction, it proceeds to simulate the antifraud systems and validates the transaction
      const transactionId = JSON.parse(message.value.toString()).transactionExternalId;
      const transaction = (await client
        .query('SELECT * FROM transactions WHERE id = $1', [ transactionId ])
        .then((payload) => {
          return payload.rows;
        }))[0];

      // If the transaction is pending, it waits 5 seconds to simulate an antifraud system processing, then it sets the status based on the transaction amount
      if (transaction.status === 'pending') {
        setTimeout(async () => {
          if (transaction.value > 1000) {
            await client.query('UPDATE transactions SET status = $1 WHERE id = $2', [ 'rejected', transactionId ]);
          } else {
            await client.query('UPDATE transactions SET status = $1 WHERE id = $2', [ 'approved', transactionId ]);
          }
        }, 5000);
      }
    },
  });
})();

// App
const app = express();
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Yape is up!');
});

// Resource to get a single transaction
//
// Example response:
// {
//   "transactionExternalId": "1",
//   "transactionStatus": {
//       "name": "pending"
//   },
//   "value": "200",
//   "createdAt": "2023-09-21T00:00:00.000Z"
// }
app.get('/transactions/:transactionExternalId', async (req, res) => {
  const result = await client
    .query('SELECT * FROM transactions WHERE id = $1', [ req.params.transactionExternalId ])
    .then((payload) => {
      return payload.rows;
    });

  if (result.length === 0) {
    res.status(404).send('Transaction not found');
    return;
  }

  res.json({
    transactionExternalId: req.params.transactionExternalId,
    transactionStatus: {
      name: result[0].status
    },
    value: result[0].value,
    createdAt: result[0].created_at
  });
});

// Resource to post a transaction
//
// Example request:
// {
//   "transactionTypeId": 1,
//   "value": 200.0
// }
//
// Example response:
//
// {
//   "transactionExternalId": 1
// }
app.post('/transactions', async (req, res) => {
  const rawResult = await client.query(`INSERT INTO transactions (status, type_id, value, created_at)
    VALUES($1, $2, $3, $4) RETURNING id`, ['pending', req.body.transactionTypeId, req.body.value, new Date().toISOString()])
    .then((payload) => {
      return payload.rows;
    });
  const transactionResult = { transactionExternalId: rawResult[0].id };

  await producer.send({
    topic: 'test-topic',
    messages: [
      { value: JSON.stringify(transactionResult) },
    ],
  });

  res.send(transactionResult);
});

(async () => {
  await client.connect();

  const seedQuery = fs.readFileSync('database-seed.sql', { encoding: 'utf8' })
  client.query(seedQuery, (err, res) => {
    console.log(err, res)
    console.log('Seeding Completed!')
  });

  app.listen(PORT, HOST, () => {
    console.log(`Running on http://${HOST}:${PORT}`);
  });
})();