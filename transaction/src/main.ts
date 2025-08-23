import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import {AppModule} from "./AppModule";
import {ConfigService} from "@nestjs/config";
import {KafkaService} from "./Transaction/Infraestructure/Kafka/Services/KafkaService";

async function bootstrap(): Promise<void> {
    const app = await NestFactory.create(AppModule);
    const config = app.get(ConfigService);
    const logger = new Logger('Main');

    const httpPort = config.get<number>('HTTP_PORT') || 3000;
    await app.listen(httpPort);
    logger.log(`HTTP server running on port ${httpPort}`);

    // Kafka configuration
    const kafkaService = app.get(KafkaService);
    await kafkaService.initialize();
    logger.log('Kafka microservice successfully started');
}

bootstrap();
