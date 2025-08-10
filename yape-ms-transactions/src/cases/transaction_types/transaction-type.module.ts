import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';

/* Project */
import { Queries } from './queries';
import { TransactionTypeEntity } from './models';
import {
  TypeormTransactionTypeRepository,
  TRANSACTION_TYPE_REPOSITORY,
} from './repositories';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([TransactionTypeEntity])],
  providers: [
    {
      provide: TRANSACTION_TYPE_REPOSITORY,
      useClass: TypeormTransactionTypeRepository,
    },
    ...Queries,
  ],
  exports: [...Queries, TRANSACTION_TYPE_REPOSITORY, TypeOrmModule],
})
export class TransactionTypeModule {}
