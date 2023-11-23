import * as rdkafka from 'node-rdkafka';

export interface KafkaAdminClientOptions {
    conf: rdkafka.GlobalConfig
}