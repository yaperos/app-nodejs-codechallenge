import { Module } from '@nestjs/common'
import { TransactionResolver } from './resolver'
import { TransactionSqlRepository } from 'src/repos/transaction/repository'
import { TransactionSqlModule } from 'src/repos/transaction/module';
import { ClientKafka, ClientsModule, Transport } from '@nestjs/microservices';
import { Partitioners } from 'kafkajs';
import { config } from '../../config'
import { TransactionController } from './controller';

@Module({
  imports: [TransactionSqlModule,
    ClientsModule.register([
      {
        name: 'TRANSACTION_KAFKA',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: config.kafka.clientId,
            brokers: [config.kafka.uri],
          },
          producer: {
            createPartitioner: Partitioners.LegacyPartitioner
          },
          consumer: {
            groupId: config.kafka.groupId,
          },
        },
      },
    ])],
  controllers: [TransactionController],
  providers: [{
    provide: 'KAFKA_PRODUCER',
    useFactory: async (kafkaService: ClientKafka) => {
      kafkaService.subscribeToResponseOf("validated_txn")
      return kafkaService.connect();
    },
    inject: ['TRANSACTION_KAFKA'],
  },TransactionSqlRepository, TransactionResolver],
})
export class TransactionApiModule { }
