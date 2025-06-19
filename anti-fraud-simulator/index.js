const { Kafka } = require('kafkajs');

class AntiFraudService {
  constructor() {
    this.kafka = new Kafka({
      clientId: 'anti-fraud-service',
      brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
    });

    this.consumer = this.kafka.consumer({ groupId: 'anti-fraud-service' });
    this.producer = this.kafka.producer();
  }

  async start() {
    console.log('Iniciando Servicio Anti-Fraude...');
    
    await this.consumer.connect();
    await this.producer.connect();

    await this.consumer.subscribe({ 
      topic: 'transaction-created', 
      fromBeginning: false 
    });

    console.log('Servicio Anti-Fraude iniciado exitosamente');
    console.log('Escuchando eventos de transacciones creadas...');

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const transactionEvent = JSON.parse(message.value.toString());
          console.log(`Transacción recibida: ${transactionEvent.transactionExternalId}`);
          
          await this.processTransaction(transactionEvent);
        } catch (error) {
          console.error('Error procesando transacción:', error);
        }
      },
    });
  }

  async processTransaction(transactionEvent) {
    const { transactionExternalId, value } = transactionEvent;
    
    console.log(`Analizando transacción ${transactionExternalId} con valor: ${value}`);

    
    await this.delay(1000 + Math.random() * 2000);

    // Regla de negocio: rechazar transacciones > 1000
    const isApproved = value <= 1000;
    const status = isApproved ? 'approved' : 'rejected';
    const reason = isApproved ? 'Transacción aprobada' : 'Valor de transacción excede el límite';

    console.log(`Transacción ${transactionExternalId}: ${status} - ${reason}`);

    const statusEvent = {
      transactionExternalId,
      status,
      reason,
      processedAt: new Date().toISOString(),
    };

    await this.producer.send({
      topic: 'transaction-status-updated',
      messages: [
        {
          key: transactionExternalId,
          value: JSON.stringify(statusEvent),
          headers: {
            'event-type': 'TransactionStatusUpdated',
          },
        },
      ],
    });

    console.log(`Actualización de estado enviada para transacción ${transactionExternalId}: ${status}`);
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async stop() {
    console.log('Deteniendo Servicio Anti-Fraude...');
    await this.consumer.disconnect();
    await this.producer.disconnect();
    console.log('Servicio Anti-Fraude detenido');
  }
}

const antiFraudService = new AntiFraudService();

process.on('SIGTERM', async () => {
  await antiFraudService.stop();
  process.exit(0);
});

process.on('SIGINT', async () => {
  await antiFraudService.stop();
  process.exit(0);
});

antiFraudService.start().catch(console.error); 