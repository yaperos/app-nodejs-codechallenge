import { KAFKA_BROKER_CONSUMER_GROUP_ID_TRANSACTION, KAFKA_CONSUMER_CLIENTID, KAFKA_INSTANCE_NAME } from '@api/constant/kafka.constant';
import { TransactionController, TypeController } from '@api/controller';
import { Transaction, TransactionSchema } from '@api/entity';
import { Type, TypeSchema } from '@api/entity/type.entity';
import { TransactionRepository, TypeRepository } from '@api/repository';
import { TransactionService, TypeService } from '@api/service';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProvider, ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';

export const TransactionKafkaClientModule = ClientsModule.registerAsync([
	{
		name: KAFKA_INSTANCE_NAME,
		useFactory: (configService: ConfigService): ClientProvider => {
			const kafkaHost = configService.get<string>('kafka.host');
			const kafkaPort = configService.get<string>('kafka.port');

			Logger.log(`Kafka host: ${kafkaHost}`, 'TransactionKafkaClientModule');
			Logger.log(`Kafka port: ${kafkaPort}`, 'TransactionKafkaClientModule');

			const brokers = [`${kafkaHost}:${kafkaPort}`];

			return {
				transport: Transport.KAFKA,
				options: {
					client: {
						brokers,
						clientId: KAFKA_CONSUMER_CLIENTID,
					},
					consumer: {
						groupId: KAFKA_BROKER_CONSUMER_GROUP_ID_TRANSACTION,
					},
					subscribe: {
						fromBeginning: true,
					},
				},
			};
		},
		inject: [ConfigService],
		imports: [ConfigModule],
	},
]);

@Module({
	imports: [
		ConfigModule,
		TransactionKafkaClientModule,
		MongooseModule.forFeature([
			{
				name: Type.name,
				schema: TypeSchema,
			},
			{
				name: Transaction.name,
				schema: TransactionSchema,
			}
		]),
	],
	controllers: [TransactionController, TypeController],
	providers: [TypeRepository, TypeService, TransactionRepository, TransactionService],
	exports: [TransactionKafkaClientModule],
})
export class KafkaModule {}
