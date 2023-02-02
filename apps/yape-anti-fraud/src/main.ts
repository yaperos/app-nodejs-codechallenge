import {NestFactory} from '@nestjs/core';
import {YapeAntiFraudModule} from './yape-anti-fraud.module';
import {MicroserviceOptions, Transport} from "@nestjs/microservices";

async function bootstrap() {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(
        YapeAntiFraudModule,
        {
            transport: Transport.KAFKA,
            options: {
                client: {
                    clientId: 'yape-af',
                    brokers: ['localhost:9092'],
                },
                consumer: {
                    groupId: 'yape-af-consumer',
                },
            },
        },
    );
    await app.listen();
}

bootstrap();
