import { KafkaClient } from 'kafka-node';
import { CONFIG } from '../utils/environments';

const client = new KafkaClient({
    kafkaHost: CONFIG.KAFKA.URL
})


export  default client;