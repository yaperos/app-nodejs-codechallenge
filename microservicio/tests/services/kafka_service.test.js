const { Kafka, Partitioners } = require('kafkajs');
//console.log(Kafka, Partitioners);
const kafkaService = require('../../services/kafka.service');


// Mock para Kafka
jest.mock('kafkajs', () => {
  const mockProducer = {
    connect: jest.fn(),
    disconnect: jest.fn(),
    send: jest.fn(),
  };

  const mockConsumer = {
    connect: jest.fn(),
    disconnect: jest.fn(),
    subscribe: jest.fn(),
    run: jest.fn(),
  };

  return {
    Kafka: jest.fn(() => ({
      producer: jest.fn(() => mockProducer),
      consumer: jest.fn(() => mockConsumer),
    })),
    Partitioners: {
      LegacyPartitioner: 'LegacyPartitioner',
    },
  };
});

describe('Kafka Service', () => {
  beforeEach(() => {
    // Limpia cualquier mock que se haya hecho antes de cada prueba
    jest.clearAllMocks();
  });

  describe('connect', () => {
    test('should connect producer and consumer to Kafka', async () => {
      // Simula la conexión exitosa del productor y el consumidor
      kafkaService.producer.connect.mockResolvedValue();
      kafkaService.consumer.connect.mockResolvedValue();

      // Ejecuta la función connect
      await kafkaService.connect();

      // Verifica si la función connect fue llamada para el productor y el consumidor
      expect(kafkaService.producer.connect).toHaveBeenCalled();
      expect(kafkaService.consumer.connect).toHaveBeenCalled();

    });
  });

  describe('disconnect', () => {
    test('should disconnect producer and consumer from Kafka', async () => {
      // Simula la desconexión exitosa del productor y el consumidor
      kafkaService.producer.disconnect.mockResolvedValue();
      kafkaService.consumer.disconnect.mockResolvedValue();

      // Ejecuta la función disconnect
      await kafkaService.disconnect();

      // Verifica si la función disconnect fue llamada para el productor y el consumidor
      expect(kafkaService.producer.disconnect).toHaveBeenCalled();
      expect(kafkaService.consumer.disconnect).toHaveBeenCalled();
    });
  });

  describe('sendToTopic', () => {
    test('should send message to Kafka topic', async () => {
      const topic = 'test-topic';
      const message = 'Hello, Kafka!';

      // Ejecuta la función sendToTopic
      await kafkaService.sendToTopic(topic, message);

      // Verifica si la función send fue llamada con los parámetros correctos
      expect(kafkaService.producer.send).toHaveBeenCalledWith({
        topic: topic,
        messages: [{ value: message }]
      });
    });
  });

  describe('subscribeToTopic', () => {
    test('should subscribe to Kafka topic and execute callback for each message', async () => {
      const topic = 'test-topic';
      const callback = jest.fn();

      // Simula la suscripción exitosa a un tema
      kafkaService.consumer.subscribe.mockResolvedValue();
      kafkaService.consumer.run.mockImplementation(({ eachMessage }) => eachMessage({ topic: topic, partition: 0, message: { value: 'Test message' } }));

      // Ejecuta la función subscribeToTopic
      await kafkaService.subscribeToTopic(topic, callback);

      // Verifica si la función subscribe y run fueron llamadas con los parámetros correctos
      expect(kafkaService.consumer.subscribe).toHaveBeenCalledWith({ topic: topic, fromBeginning: true });
      expect(callback).toHaveBeenCalledWith('Test message');
    });
  });
});
