import { join } from 'path';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import { KafkaModule } from '../kafka/kafka.module';
import { Transaction } from './entities/Transaction.entity';
import DateScalar from '../commons/graphql/scalars/date.scalar';
import NumericID from '../commons/graphql/scalars/numeric-id.scalar';
import { TransactionService } from './services/transaction.service';
import { TransactionResolver } from './resolvers/transaction.resolver';
import { TransactionController } from './controllers/transaction.controller';

@Module({
  controllers: [TransactionController],
  imports: [
    TypeOrmModule.forFeature([Transaction]),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: true,
      typePaths: ['./**/*.graphql'],
      definitions: {
        path: join(process.cwd(), 'src/transaction/graphql/types.ts'),
        outputAs: 'class',
      },
      resolvers: {
        Date: DateScalar,
        NumericID: NumericID,
      },
    }),
    KafkaModule,
  ],
  providers: [TransactionResolver, TransactionService],
})
export class TransactionModule {}
