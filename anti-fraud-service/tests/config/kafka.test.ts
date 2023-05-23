/* eslint-disable no-undef */

import { Kafka } from 'kafkajs';
import {
  kafkaConsumerMock, kafkaProducerMock,
} from '../__mocks__/kafka.mock';
import { KafkaClient } from '../../src/config/kafka';

let kafkaClient: KafkaClient;
const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => { });

const producerDisconnectMock = jest.fn().mockImplementation(() => { });
const producerConnectMock = jest.fn().mockImplementation(() => { });
const producerSendMock = jest.fn().mockImplementation(() => { });

kafkaProducerMock.mockImplementation(() => ({
  connect: producerConnectMock,
  send: producerSendMock,
  disconnect: producerDisconnectMock,
}));

const consumerDisconnectMock = jest.fn().mockImplementation(() => { });
const consumerConnectMock = jest.fn().mockImplementation(() => { });
const consumerSubscribeMock = jest.fn().mockImplementation(() => { });
const consumerRunMock = jest.fn().mockImplementation(() => { });

kafkaConsumerMock.mockImplementation(() => ({
  connect: consumerConnectMock,
  subscribe: consumerSubscribeMock,
  run: consumerRunMock,
  disconnect: consumerDisconnectMock,
}));

describe('Kafka client tests', () => {
  beforeAll(() => {
    const kafka = new Kafka({ brokers: ['any_host'] });
    kafkaClient = new KafkaClient(kafka);
  });

  beforeEach(() => {
    consoleErrorMock.mockClear();

    producerDisconnectMock.mockClear();
    producerConnectMock.mockClear();
    producerSendMock.mockClear();

    consumerDisconnectMock.mockClear();
    consumerConnectMock.mockClear();
    consumerSubscribeMock.mockClear();
    consumerRunMock.mockClear();
  });

  describe('Clear connections tests', () => {
    it('shuld be completed correctly if no consumers exist', async () => {
      await kafkaClient.closeConnections();

      expect(consumerDisconnectMock).toHaveBeenCalledTimes(0);
    });

    it('shuld be completed correctly with consumers', async () => {
      await kafkaClient.createSubscription({ topic: 'random-topic' }, () => { });
      await kafkaClient.createSubscription({ topic: 'random-topic' }, () => { });
      await kafkaClient.createSubscription({ topic: 'random-topic' }, () => { });
      await kafkaClient.createSubscription({ topic: 'random-topic' }, () => { });

      await kafkaClient.closeConnections();
      expect(consumerDisconnectMock).toHaveBeenCalledTimes(4);
      expect(consoleErrorMock).toHaveBeenCalledTimes(0);
    });

    it('shuld return error if client throws error', async () => {
      consumerDisconnectMock.mockImplementationOnce(() => { throw new Error('Random error'); });

      await kafkaClient.createSubscription({ topic: 'random-topic' }, () => { });
      await kafkaClient.closeConnections();

      expect(consoleErrorMock).toHaveBeenCalledTimes(1);
      expect(consoleErrorMock).toHaveBeenCalledWith('Error when closing connections');
    });
  });

  describe('Send message tests', () => {
    it('shuld send message correctly', async () => {
      await kafkaClient.sendMessage('random-topic', 'random-message');

      expect(producerDisconnectMock).toHaveBeenCalledTimes(1);
      expect(producerConnectMock).toHaveBeenCalledTimes(1);
      expect(producerSendMock).toHaveBeenCalledTimes(1);
    });

    it('shuld return error if client throws error on connection', async () => {
      producerConnectMock.mockImplementationOnce(() => { throw new Error('Random error'); });

      await kafkaClient.sendMessage('random-topic', 'random-message');

      expect(producerSendMock).toHaveBeenCalledTimes(0);
      expect(consoleErrorMock).toHaveBeenCalledTimes(1);
      expect(consoleErrorMock).toHaveBeenCalledWith('Error when sending message to random-topic');
    });

    it('shuld return error if client throws error on send', async () => {
      producerSendMock.mockImplementationOnce(() => { throw new Error('Random error'); });

      await kafkaClient.sendMessage('random-topic', 'random-message');

      expect(consoleErrorMock).toHaveBeenCalledTimes(1);
      expect(consoleErrorMock).toHaveBeenCalledWith('Error when sending message to random-topic');
    });
  });

  describe('Create subscription tests', () => {
    it('shuld create subscription correctly', async () => {
      await kafkaClient.createSubscription({ topic: 'random-topic' }, () => { });

      expect(consumerConnectMock).toHaveBeenCalledTimes(1);
      expect(consumerSubscribeMock).toHaveBeenCalledTimes(1);
      expect(consumerRunMock).toHaveBeenCalledTimes(1);
      expect(consoleErrorMock).toHaveBeenCalledTimes(0);
    });

    it('shuld return error if client throws error on connection', async () => {
      consumerConnectMock.mockImplementationOnce(() => { throw new Error('Random error'); });

      await kafkaClient.createSubscription({ topic: 'random-topic' }, () => { });

      expect(consumerRunMock).toHaveBeenCalledTimes(0);
      expect(consumerSubscribeMock).toHaveBeenCalledTimes(0);
      expect(consoleErrorMock).toHaveBeenCalledTimes(1);
      expect(consoleErrorMock).toHaveBeenCalledWith('Error when creating new consumer');
    });

    it('shuld return error if client throws error on subscription', async () => {
      consumerSubscribeMock.mockImplementationOnce(() => { throw new Error('Random error'); });

      await kafkaClient.createSubscription({ topic: 'random-topic' }, () => { });

      expect(consumerRunMock).toHaveBeenCalledTimes(0);
      expect(consoleErrorMock).toHaveBeenCalledTimes(1);
      expect(consoleErrorMock).toHaveBeenCalledWith('Error when creating new consumer');
    });

    it('shuld return error if client throws error on run', async () => {
      consumerRunMock.mockImplementationOnce(() => { throw new Error('Random error'); });

      await kafkaClient.createSubscription({ topic: 'random-topic' }, () => { });

      expect(consoleErrorMock).toHaveBeenCalledTimes(1);
      expect(consoleErrorMock).toHaveBeenCalledWith('Error when creating new consumer');
    });
  });
});
