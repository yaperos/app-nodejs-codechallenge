import { Injectable, Inject, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { kafkaConfig } from '../config/kafka.config';
import { Kafka, Producer, Partitioners } from 'kafkajs';
import { Observable } from 'rxjs';

@Injectable()
export class ReactiveKafkaProducer implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(ReactiveKafkaProducer.name);
  private kafka: Kafka;
  private producer: Producer;

  constructor(
    @Inject(kafkaConfig.KEY)
    private readonly kafkaConfiguration: ConfigType<typeof kafkaConfig>,
  ) {
    this.kafka = new Kafka({
      clientId: 'nestjs-producer',
      brokers: this.kafkaConfiguration.bootstrapServers,
      connectionTimeout: 10000,
      requestTimeout: 30000,
    });

    this.producer = this.kafka.producer({
      createPartitioner: Partitioners.LegacyPartitioner, // ✅ Sin warnings
    });

    this.logger.log(`🔧 Kafka Producer configured with brokers: ${this.kafkaConfiguration.bootstrapServers.join(', ')}`);
  }

  async onModuleInit() {
    try {
      this.logger.log('🔄 Connecting to Kafka Producer...');
      await this.producer.connect();
      this.logger.log('✅ Kafka Producer connected successfully');
    } catch (error) {
      this.logger.error('❌ Failed to connect Kafka Producer:', error);
    }
  }

  async onModuleDestroy() {
    try {
      await this.producer.disconnect();
      this.logger.log('Kafka Producer disconnected');
    } catch (error) {
      this.logger.error('Error disconnecting Kafka Producer:', error);
    }
  }

  sendMessage(topic: string, key: string, value: string): Observable<void> {
    return new Observable(observer => {
      this.producer.send({
        topic,
        messages: [{ key, value }],
      })
      .then(() => {
        this.logger.log(`📤 Message sent to topic ${topic}: ${key}`);
        observer.next();
        observer.complete();
      })
      .catch(error => {
        this.logger.error(`❌ Error sending message to topic ${topic}:`, error);
        observer.error(error);
      });
    });
  }
}