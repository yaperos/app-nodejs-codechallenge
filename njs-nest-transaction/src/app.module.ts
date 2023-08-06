import { LoggerMiddleware } from './api/middleware';
import { dotEnvOptions } from './api/util';
import { HttpConfig, LoggerConfig } from './config';
import { HttpModule } from '@nestjs/axios';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import * as dotenv from 'dotenv';
import { WinstonModule } from 'nest-winston';

import apiConfig from './config/app.config';
import mongoConfig from './config/mongo.config';

import kafkaConfig from './config/kafka.config';
import { HealthController, TransactionController } from '@api/controller';
import { KafkaModule, TransactionKafkaClientModule } from '@api/module/kafka.module';
import { TransactionMongooseModule } from '@api/module/mongo.module';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { DevtoolsModule } from "@nestjs/devtools-integration";
import { GraphQLModule } from '@nestjs/graphql';

dotenv.config({ path: dotEnvOptions.path });

const logger: LoggerConfig = new LoggerConfig();
const http: HttpConfig = new HttpConfig();

@Module({
	imports: [
		GraphQLModule.forRoot<ApolloDriverConfig>({
			driver: ApolloDriver,
			autoSchemaFile: './schema.gql',
			sortSchema: true,
			introspection: true,
			playground: true,
			path: '/graphql',
		}),		
		ConfigModule.forRoot({
			envFilePath: [dotEnvOptions.path, '.env'],
			load: [mongoConfig, apiConfig, kafkaConfig],
			isGlobal: true,
		}),
		WinstonModule.forRoot(logger.console()),
		TransactionMongooseModule,
		HttpModule.register(http.getOptions()),
		TerminusModule,
		TransactionKafkaClientModule,
		KafkaModule,
		DevtoolsModule.register({
			http: process.env.NODE_ENV !== 'production',
			port: 8000,
		}),
	],
	controllers: [HealthController],
	providers: [],
})
export class AppModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(LoggerMiddleware).forRoutes(TransactionController);
	}
}
