import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { Kafka, Producer, Consumer, logLevel } from 'kafkajs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(KafkaService.name);
    private kafka: Kafka | null = null;
    private producer!: Producer;
    private consumer!: Consumer;
    private isInitialized = false;
    private subscribedTopics = new Set<string>();
    private messageHandlers: Map<string, (message: object) => Promise<void>> = new Map();

    constructor(private readonly config: ConfigService) {}

    async onModuleInit(): Promise<void> {
        await this.initialize();
    }

    async onModuleDestroy(): Promise<void> {
        await this.shutdown();
    }

    public async initialize(): Promise<void> {
        if (this.isInitialized) return;

        this.kafka = new Kafka({
            clientId: this.config.get('KAFKA_CLIENT_ID', 'transaction-service-1'),
            brokers: [this.config.get<string>('KAFKA_BROKER', 'localhost:9092')],
            logLevel: logLevel.ERROR,
            retry: {
                maxRetryTime: 30000,
                initialRetryTime: 1000,
                retries: 10,
                factor: 0.2,
            },
        });

        this.producer = this.kafka.producer({
            allowAutoTopicCreation: false, // Mejor en producción
            idempotent: true,
            maxInFlightRequests: 5, // para idempotencia
            retry: { retries: 5 },
        });

        this.consumer = this.kafka.consumer({
            groupId: this.config.get('KAFKA_GROUP_ID', 'transaction-service-group-1'),
            sessionTimeout: 30000,
            heartbeatInterval: 3000
        });

        this.isInitialized = true;
        await this.connectWithRetry();


        // Inicia un único `run()` para manejar todos los topics
        await this.consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                const value = message.value?.toString();
                if (!value) {
                    this.logger.warn(`Empty message received from ${topic}[${partition}]`);
                    return;
                }
                try {
                    const handler = this.messageHandlers.get(topic);
                    if (handler) {
                        await handler(JSON.parse(value));
                    } else {
                        this.logger.warn(`No handler registered for topic ${topic}`);
                    }
                } catch (err) {
                    if (err instanceof Error) {
                        this.logger.error(`Error processing message from ${topic}`, err.stack);
                    }
                }
            }
        });
    }

    private async connectWithRetry(retries = 5, delay = 3000): Promise<void> {
        try {
            if (!this.producer || !this.consumer) {
                throw new Error('Producer or Consumer not initialized');
            }
            await Promise.all([this.producer.connect(), this.consumer.connect()]);
            this.logger.log('Connected to Kafka successfully');
        } catch (error) {
            if (error instanceof Error) {
                if (retries > 0) {
                    this.logger.warn(`Connection failed. Retrying in ${delay}ms... (${retries} retries left)`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                    return this.connectWithRetry(retries - 1, Math.min(delay * 2, 30000));
                }
                throw new Error(`Failed to connect to Kafka after retries: ${error.message}`);
            }
            throw new Error('Unknown error occurred during Kafka connection');
        }
    }

    public async shutdown(): Promise<void> {
        try {
            if (this.producer) await this.producer.disconnect();
            if (this.consumer) await this.consumer.disconnect();
            this.logger.log('Kafka connections closed');
        } catch (error) {
            if (error instanceof Error) {
                this.logger.error('Error during Kafka shutdown', error.stack);
            } else {
                this.logger.error('Unknown error during Kafka shutdown');
            }
        } finally {
            this.kafka = null;
            this.isInitialized = false;
            this.subscribedTopics.clear();
            this.messageHandlers.clear();
        }
    }

    public async publisher(topic: string, message: object): Promise<void> {
        if (!this.isInitialized || !this.producer) {
            throw new Error('Kafka service not initialized');
        }
        try {
            await this.producer.send({
                topic,
                acks: -1,
                messages: [{ value: JSON.stringify(message) }],
            });
            this.logger.debug(`Message sent to topic ${topic}`);
        } catch (error) {
            if (error instanceof Error) {
                this.logger.error(`Failed to send message to ${topic}`, error.stack);
            }
            throw error;
        }
    }

    public async subscribe(topic: string, callback: (message: object) => Promise<void>): Promise<void> {
        if (!this.isInitialized || !this.consumer) {
            throw new Error('Kafka service not initialized');
        }
        if (this.subscribedTopics.has(topic)) {
            this.logger.warn(`Already subscribed to ${topic}`);
            return;
        }

        try {
            await this.consumer.subscribe({ topic, fromBeginning: true });
            this.subscribedTopics.add(topic);
            this.messageHandlers.set(topic, callback);

            this.logger.log(`Subscribed to ${topic} successfully`);
        } catch (error) {
            this.logger.log(`Subscribed | error ${JSON.stringify(error)}`);
        }
    }
}
