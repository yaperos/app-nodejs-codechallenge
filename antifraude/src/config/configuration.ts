import { registerAs } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';

export default registerAs('config', () => {
   return { 
        kafka: {
          transport: Transport.KAFKA,
          options: {
            client: {
              brokers: process.env.KAFKA_BROKER.split('|'),
              logLevel: parseInt(process.env.KAFKA_LOG_LEVEL,10),               
            },
            consumer: {
              groupId: process.env.KAFKA_CONSUMER_GROUP_ID,
            }
          }
        }
    }
})