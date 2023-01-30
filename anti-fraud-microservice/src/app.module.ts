import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import config from 'config/configuration';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [config]
		}),
		ClientsModule.registerAsync(
			[
				{
					name:'TRANSACTION_SERVICE',
					imports: [ConfigModule],
					useFactory:async (configService:ConfigService) =>({
						transport:Transport.KAFKA,
						options:{
							client:{
								clientId: 'transaction',
								brokers:[configService.get('KAFKA_BROKER')],
							},
							consumer: {
								groupId: 'transaction-consumer',
							},
							producer: {
								allowAutoTopicCreation: true,
							}
						}
					}),
					inject: [ConfigService]
				}
			]
		),
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
