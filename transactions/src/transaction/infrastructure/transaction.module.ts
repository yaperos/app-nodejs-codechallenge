// Se ubica en infraestructura porque tiene intereacción con la base de datos
import { Global, Module, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionRepositoryImpl } from './repositories/sql/transaction.repository';
import { TransactionServiceImpl } from '../application/services/transaction.service';
import { TransactionEntity } from './repositories/sql/transaction.entity';
import { TransactionController } from './controllers/transaction.controller';

export const transactionProviders: Provider[] = [
  {
    provide: 'TransactionRepository',
    useClass: TransactionRepositoryImpl,
  },
  {
    provide: 'TransactionService',
    useClass: TransactionServiceImpl,
  },
];
@Global()
@Module({
  imports: [TypeOrmModule.forFeature([TransactionEntity])],
  controllers: [TransactionController],
  providers: [...transactionProviders],
  exports: [...transactionProviders],
})
export class TransactionModule {}
