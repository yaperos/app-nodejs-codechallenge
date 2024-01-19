import { Module } from '@nestjs/common';
import { TransactionController } from './app.controller';
import { AppService } from './app.service';
import { CqrsModule } from '@nestjs/cqrs';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { GetTransactionHandler } from './application/query/getTransaction';
import { TransactionInfrastructure } from './infrastructure/transaction.infrastructure';
import { PostTransactionCommandHandler } from './application/command/postTransaction';
import { UpdateTransactionCommandHandler } from './application/command/updateTransaction';

@Module({
  imports: [
    CqrsModule,
    ClientsModule.register([
      {
        name: 'GENERATE_TRANSACTION',
        transport: Transport.KAFKA,
        options: {
          client:{
            brokers: ['localhost:9092']
          },
          consumer: {
            groupId: 'transaction-consumer'
          }
        }
      }
    ])
  ],
  controllers: [TransactionController],
  providers: [
    AppService, 
    GetTransactionHandler, PostTransactionCommandHandler, UpdateTransactionCommandHandler, 
    TransactionInfrastructure]
})
export class AppModule {}
