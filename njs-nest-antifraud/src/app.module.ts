import { HttpModule } from '@nestjs/axios';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { TerminusModule } from '@nestjs/terminus';
import * as dotenv from 'dotenv';
import { WinstonModule } from 'nest-winston';

import { LoggerMiddleware } from './api/middleware';

import { dotEnvOptions } from './api/util';
import { HttpConfig, LoggerConfig } from './config';
import kafkaConfig from './config/kafka.config';
import { Environment } from './enum';
import { KAFKA_BROKER_CONSUMER_GROUP_ID_ANTIFRAUD, KAFKA_INSTANCE_NAME } from '@api/constant/kafka.constant';
import { AntifraudController } from '@api/controller/antifraud.controller';
import { AntiFraudService } from '@api/service/antifraud.service';
import { ClientsModule, MicroserviceOptions, Transport } from '@nestjs/microservices';

dotenv.config({ path: dotEnvOptions.path });

const logger: LoggerConfig = new LoggerConfig();
const http: HttpConfig = new HttpConfig();

const brokersStr = process.env.KAFKA_BROKERS || 'kafka:9092,kafka:9093,kafka:9094';
const brokers = brokersStr.split(',');

const kafkaConfigDetails: MicroserviceOptions = {
	transport: Transport.KAFKA,
	options: {
		client: {
			brokers,
			clientId: 'transaction',
		},
		consumer: {
			groupId: KAFKA_BROKER_CONSUMER_GROUP_ID_ANTIFRAUD,
		},
		run: {
			autoCommit: false,
		},
	},
};

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: [dotEnvOptions.path, '.env'],
			load: [kafkaConfig],
			isGlobal: true,
		}),
		WinstonModule.forRoot(logger.console()),
		HttpModule.register(http.getOptions()),
		TerminusModule,
		DevtoolsModule.register({
			http: process.env.NODE_ENV !== Environment.Production,
			port: 8000,
		}),
		ClientsModule.register([
			{
				name: KAFKA_INSTANCE_NAME,
				...kafkaConfigDetails,
			}
		])
	],
	controllers: [AntifraudController],
	providers: [AntiFraudService],
})
export class AppModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(LoggerMiddleware).forRoutes('*');
	}
}
