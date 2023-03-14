import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransactionSchema } from './domain/entities';
import { GetTransactionsHandler } from './domain/handlers';
import { TransactionController } from './infrastructure/controllers/transaction.controller';
import { TransactionRepository } from './infrastructure/repository/transaction.repository';

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forRoot('mongodb://localhost/transactions'),
    MongooseModule.forFeature([
      { name: 'TRANSACTION', schema: TransactionSchema },
    ]),
  ],
  controllers: [AppController, TransactionController],
  providers: [
    AppService,
    { useClass: TransactionRepository, provide: 'TRANSACTION_REPOSITORY' },
    GetTransactionsHandler,
  ],
})
export class AppModule {}
