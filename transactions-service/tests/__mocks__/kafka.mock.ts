/* eslint-disable no-undef */
import 'reflect-metadata';

const kafkaProducerMock = jest.fn().mockImplementation(() => ({
  connect: () => ({}),
  send: () => ({}),
  disconnect: () => ({}),
}));

const kafkaConsumerMock = jest.fn().mockImplementation(() => ({
  connect: () => ({}),
  subscribe: () => ({}),
  run: () => ({}),
  disconnect: () => ({}),
}));

const kafkaMock = jest.mock('kafkajs', () => ({
  Kafka: jest.fn().mockImplementation(() => ({
    producer: kafkaProducerMock,
    consumer: kafkaConsumerMock,
  })),
}));

export { kafkaMock, kafkaConsumerMock, kafkaProducerMock };
