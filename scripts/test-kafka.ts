#!/usr/bin/env node

import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'test-producer',
  brokers: ['localhost:9092'],
});

const producer = kafka.producer();

async function sendTestMessage() {
  await producer.connect();
  
  const message = {
    transactionExternalId: 'test-uuid-123',
    value: 500,
    accountExternalIdDebit: 'debit-uuid',
    accountExternalIdCredit: 'credit-uuid',
    transferTypeId: 1,
  };

  await producer.send({
    topic: 'transaction.created',
    messages: [
      {
        key: message.transactionExternalId,
        value: JSON.stringify(message),
      },
    ],
  });

  console.log('Test message sent:', message);
  await producer.disconnect();
}

sendTestMessage().catch(console.error);
