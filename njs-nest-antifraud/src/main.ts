import 'reflect-metadata';

import { AppModule } from './app.module';
import { LoggerConfig } from './config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonModule } from 'nest-winston';

import { varMsjApp } from './enum';
import { KAFKA_BROKER_CONSUMER_GROUP_ID_ANTIFRAUD } from '@api/constant/kafka.constant';

async function bootstrap() {
	const logger: LoggerConfig = new LoggerConfig();

	const winstonLogger = WinstonModule.createLogger(logger.console());

	const brokerUrl = process.env.KAFKA_BROKER_HOST || 'localhost';
	const brokerPort = process.env.KAFKA_BROKER_PORT || 9092;

	const kafkaConfig: MicroserviceOptions = {
		transport: Transport.KAFKA,
		options: {
			client: {
				brokers: [`${brokerUrl}:${brokerPort}`],
				clientId: 'kafka-client',
			},
			consumer: {
				groupId: KAFKA_BROKER_CONSUMER_GROUP_ID_ANTIFRAUD,
			},
			subscribe: {
				fromBeginning: true,
			},
		},
	};

	const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, kafkaConfig);

	winstonLogger.log(varMsjApp.APP_WELCOME_MESSAGE);

	app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

	await app.listen();
}

bootstrap();
