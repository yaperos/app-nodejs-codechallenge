import {NestFactory} from '@nestjs/core';
import {MicroserviceOptions, Transport} from "@nestjs/microservices";
import {Anti_fraudModule} from './anti_fraud.module';
import {CompressionTypes} from "@nestjs/microservices/external/kafka.interface";

async function bootstrap() {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(
        Anti_fraudModule,
        {
            transport: Transport.KAFKA,
            options: {
                send: {
                    timeout: 1000,
                    compression: CompressionTypes.GZIP
                },
                client: {
                    brokers: ['localhost:9092'],
                    clientId: 'transaction',
                },
                consumer: {
                    groupId: 'transaction-consumer',
                    retry: {
                        retries: 3,
                        maxRetryTime: 3,
                    }
                },
                producer: {
                    idempotent: true,
                    retry: {
                        retries: 2
                    }
                },
            }
        },
    );
    await app.listen()
}
bootstrap();
