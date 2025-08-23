

import { Logger } from '@nestjs/common';
import {createKafkaClient} from "./AntiFraud/Infrastructure/Kafka/Config/KafkaConfig";
import {AntiFraudService} from "./AntiFraud/Domain/Services/AntiFraudService";
import {ValidateAntiFraudUseCase} from "./AntiFraud/Application/UseCases/ValidateAntiFraudUseCase";
import {KafkaEventConsumer} from "./AntiFraud/Infrastructure/Kafka/Events/KafkaEventConsumer";
import {KafkaEventPublish} from "./AntiFraud/Infrastructure/Kafka/Events/KafkaEventPublish";
import {NUMBER} from "./AntiFraud/Domain/Constants/CommonConstants";
import {NestFactory} from "@nestjs/core";
import {AppModule} from "./AppModule";
import {ConfigService} from "@nestjs/config";

async function bootstrap(): Promise<void> {
    const app = await NestFactory.createApplicationContext(AppModule);
    const logger = new Logger('App');
    const configService = app.get(ConfigService);

    const kafka = createKafkaClient(
        configService.get<string>('KAFKA_CLIENT_ID') || '',
        configService.get<string>('KAFKA_BROKERS') || '',
    );

    const eventConsumer = new KafkaEventConsumer(
        kafka,
        configService.get<string>('TOPIC_EVENT_CREATED') || '',
        configService.get<string>('KAFKA_GROUP_ID') || '',
    );

    const eventProducer = new KafkaEventPublish(kafka, configService.get<string>('TOPIC_EVENT_UPDATED') || '');

    const antiFraudService = new AntiFraudService();

    // Use case
    const useCase = new ValidateAntiFraudUseCase(
        eventConsumer,
        eventProducer,
        antiFraudService
    );

    // Execution
    await useCase.execute();
    logger.log('Anti-Fraud Service is running and listening for transactions...');
}

bootstrap().catch(err => {
    console.error('Anti-Fraud Service failed to start', err);
    process.exit(NUMBER.ONE);
});
