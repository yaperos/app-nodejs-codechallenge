import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { TransactionModule } from './transaction/transaction.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './transaction/entities/transaction.entity';
import { TransactionStatus } from './transaction/entities/transactionStatus.entity';
import { TransactionType } from './transaction/entities/transactionType.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'postgres',
      entities: [Transaction, TransactionStatus, TransactionType],
      synchronize: true, //not use in production
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      // debug: true,
      playground: true,
      include: [],
      autoSchemaFile: join(
        process.cwd(),
        'apps/api-transactions/src/schema.gql',
      ),
    }),
    TransactionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
