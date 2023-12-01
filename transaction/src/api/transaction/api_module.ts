import { Module } from '@nestjs/common'
import { TransactionController } from './controller'
import { TransactionSqlRepository } from 'src/repos/transaction/repository'
import { TransactionSqlModule } from 'src/repos/module'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { config } from '../../config'
import { Partitioners } from 'kafkajs'

@Module({
    imports: [TransactionSqlModule,ClientsModule.register([
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
    providers: [TransactionSqlRepository],
})
export class TransactionApiModule {}
