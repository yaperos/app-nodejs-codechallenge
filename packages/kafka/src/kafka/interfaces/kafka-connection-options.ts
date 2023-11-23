import { KafkaAdminClientOptions } from './kafka-admin-client-options';
import { KafkaConsumerOptions } from './kafka-consumer-options';
import { KafkaProducerOptions } from './kafka-producer-options';

export interface KafkaConnectionOptions {
    consumer?: KafkaConsumerOptions,
    producer?: KafkaProducerOptions
    adminClient?: KafkaAdminClientOptions
}