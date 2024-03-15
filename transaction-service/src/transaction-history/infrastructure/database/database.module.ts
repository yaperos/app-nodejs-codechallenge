import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { connectionOptions } from './datasource';
import { TransactionCatalogEntity } from './entities/TransactionCatalog.entity';
import { TransactionEntity } from './entities/Transaction.entity';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...connectionOptions,
      poolSize: 10,
      migrations: [],
      entities: [TransactionCatalogEntity, TransactionEntity],
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
