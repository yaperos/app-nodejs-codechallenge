import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PrismaService } from 'prisma/prisma.service';
import { TransactionService } from './transaction.service';
import { TransactionResolver } from './transaction.resolver';
import { TransactionController } from './transaction.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';

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
					name:'ANTIFRAUD_SERVICE',
					imports: [ConfigModule],
					useFactory:async (configService:ConfigService) =>({
						transport:Transport.KAFKA,
						options:{
							client:{
								clientId: 'antifraud',
								brokers:[configService.get('KAFKA_BROKER')],
							},
							consumer: {
								groupId: 'antifraud-consumer',
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
	providers: [TransactionResolver, TransactionService, PrismaService],
	controllers: [TransactionController],
	exports: [TransactionResolver, TransactionService],
})

export class TransactionModule {}
