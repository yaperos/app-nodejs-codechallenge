// Se ubica en infraestructura porque tiene intereacción con la base de datos
import { Global, Module, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionRepositoryImpl } from './repository_sql/transaction.repository';
import { TransactionServiceImpl } from '../application/services/transaction.service';
import { TransactionEntity } from './repository_sql/transaction.entity';
import { TransactionResolver } from './resolver/transaction.resolver';

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
  controllers: [],
  providers: [TransactionResolver, ...transactionProviders],
  exports: [...transactionProviders],
})
export class TransactionModule {}
