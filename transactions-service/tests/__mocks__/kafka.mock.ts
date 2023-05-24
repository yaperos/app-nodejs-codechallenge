/* eslint-disable no-undef */
import 'reflect-metadata';

const producerDisconnectMock = jest.fn().mockImplementation(() => { });
const producerConnectMock = jest.fn().mockImplementation(() => { });
const producerSendMock = jest.fn().mockImplementation(() => { });

const consumerDisconnectMock = jest.fn().mockImplementation(() => { });
const consumerConnectMock = jest.fn().mockImplementation(() => { });
const consumerSubscribeMock = jest.fn().mockImplementation(() => { });
const consumerRunMock = jest.fn().mockImplementation(() => { });

const kafkaProducerMock = jest.fn().mockImplementation(() => ({
  connect: producerConnectMock,
  send: producerSendMock,
  disconnect: producerDisconnectMock,
}));

const kafkaConsumerMock = jest.fn().mockImplementation(() => ({
  connect: consumerConnectMock,
  subscribe: consumerSubscribeMock,
  run: consumerRunMock,
  disconnect: consumerDisconnectMock,
}));

const kafkaMock = jest.fn().mockImplementation(() => ({
  producer: kafkaProducerMock,
  consumer: kafkaConsumerMock,
}));

jest.mock('kafkajs', () => ({
  Kafka: kafkaMock,
}));

export {
  kafkaMock,
  kafkaProducerMock,
  producerDisconnectMock,
  producerConnectMock,
  producerSendMock,
  kafkaConsumerMock,
  consumerConnectMock,
  consumerSubscribeMock,
  consumerRunMock,
  consumerDisconnectMock,
};
