import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionUseCasesService } from './aplication/useCases/transaction-use-case.service';
import { TransactionRepository } from './infrastructure/repository/transaction.repository';
import { Transaction, TransactionSchema } from './domain/entities/transaction';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  controllers: [TransactionController],
  providers: [
    { provide: 'TransactionUseCases', useClass: TransactionUseCasesService },
    { provide: 'TransactionRepository', useClass: TransactionRepository },
  ],
  imports: [
    MongooseModule.forFeature([
      {
        name: Transaction.name,
        schema: TransactionSchema,
      },
    ]),
    ClientsModule.register([
      {
        name: 'TRANSACTION_EVENT',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'trans-consumer',
          },
        },
      },
    ]),
  ],
  exports: [MongooseModule]
})
export class TransactionModule {}
