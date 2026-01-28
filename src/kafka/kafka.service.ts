import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Kafka, Producer, Consumer } from 'kafkajs';

@Injectable()
export class KafkaService implements OnModuleDestroy {
  private kafka: Kafka;
  private producer: Producer;
  private consumer: Consumer;

  constructor() {
    this.kafka = new Kafka({
      clientId: 'transaction-service',
      brokers: ['localhost:9092'],
    });

    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({ groupId: 'anti-fraud-group' });
  }

  async connect() {
    try {
      await this.producer.connect();
      await this.consumer.connect();
      console.log('✅ Conectado a Kafka');
    } catch (error) {
      console.log('⚠️  No se pudo conectar a Kafka, usando modo simulado');
    }
  }

  async sendMessage(topic: string, message: any) {
    try {
      await this.producer.send({
        topic,
        messages: [{ value: JSON.stringify(message) }],
      });
    } catch (error) {
      console.log(`⚠️  Error enviando a Kafka, simulando: ${topic}`, message);
      // Simular el envío
      this.simulateKafka(topic, message);
    }
  }

  async subscribe(topic: string, callback: (message: any) => void) {
    try {
      await this.consumer.subscribe({ topic, fromBeginning: true });
      
      await this.consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          const value = JSON.parse(message.value.toString());
          callback(value);
        },
      });
    } catch (error) {
      console.log(`⚠️  No se pudo suscribir a ${topic}, usando modo simulado`);
    }
  }

  private simulateKafka(topic: string, message: any) {
    // Simulación de Kafka para desarrollo
    setTimeout(() => {
      if (topic === 'transaction.created') {
        // Simular validación antifraude
        const status = message.value > 1000 ? 'rejected' : 'approved';
        
        // Simular envío de respuesta
        if (this.onTransactionValidated) {
          this.onTransactionValidated({
            transactionExternalId: message.transactionExternalId,
            status,
            rejectionReason: status === 'rejected' ? 'Amount exceeds limit' : undefined,
          });
        }
      }
    }, 1000);
  }

  private onTransactionValidated: ((message: any) => void) | null = null;

  onModuleDestroy() {
    this.producer?.disconnect();
    this.consumer?.disconnect();
  }
}