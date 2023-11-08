import { KafkajsConsumer } from './kafkajs.consumer';
import { ConsumerConfig, ConsumerSubscribeTopics } from 'kafkajs';

describe('KafkajsConsumer', () => {
  let kafkajsConsumer: KafkajsConsumer;
  const mockConsumerConfig: ConsumerConfig = {
    groupId: 'test-group',
  };
  const mockTopic: ConsumerSubscribeTopics = {
    topics: ['test-topic'],
  };
  const mockBroker = 'localhost:9092';

  beforeEach(() => {
    kafkajsConsumer = new KafkajsConsumer(mockTopic, mockConsumerConfig, mockBroker);
  });

  it('should be defined', () => {
    expect(kafkajsConsumer).toBeDefined();
  });

  it('should connect to Kafka', async () => {
    const mockConnect = jest.spyOn(kafkajsConsumer['consumer'], 'connect');
    await kafkajsConsumer.connect();
    expect(mockConnect).toHaveBeenCalledTimes(1);
  });

  it('should disconnect from Kafka', async () => {
    const mockDisconnect = jest.spyOn(kafkajsConsumer['consumer'], 'disconnect');
    await kafkajsConsumer.disconnect();
    expect(mockDisconnect).toHaveBeenCalledTimes(1);
  });

  it('should consume messages', async () => {
    const mockOnMessage = jest.fn(); 

    const mockRun = jest.spyOn(kafkajsConsumer['consumer'], 'run');
    await kafkajsConsumer.consume(mockOnMessage);
    expect(mockRun).toHaveBeenCalledTimes(1);

  });

  it('should add message to DLQ', async () => {
    const mockMessage = {
      value: Buffer.from('Mensaje de prueba'),
      key: null, //
      timestamp: '2023-11-08T10:00:00Z', 
      attributes: 0, 
      offset: '12345', 
      headers: null, 
    };
    const mockAddMessageToDlq = jest.spyOn(kafkajsConsumer as any, 'addMessageToDlq');
    await kafkajsConsumer['addMessageToDlq'](mockMessage);
    expect(mockAddMessageToDlq).toHaveBeenCalledTimes(1);
  });
});