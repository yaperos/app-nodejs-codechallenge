import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { Transport } from '@nestjs/microservices';
import { ClientsModule } from '@nestjs/microservices/module';
import { CreateTransactionHandler } from './application/commands/create-transaction/create-transaction';
import { DBProvider } from './DBProvider';
import { TransactionInfrastructure } from './infrastructure/transaction.infrastructure';
import { TransactionController } from './interfaces/http/transaction.controller';
@Module({
  imports: [
    CqrsModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    ClientsModule.register([
       {
        name: 'TRANSACTION_MICROSERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'transaction',
            brokers: [process.env.KAFKA_BROKER],
          },
          consumer: {
            groupId: 'transaction-consumer',
          },
        },
       }

    ]),
  ],
  controllers: [TransactionController],
  providers: [DBProvider,CreateTransactionHandler,TransactionInfrastructure],
})
export class AppModule {}
