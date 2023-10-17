import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { TransactionResolver } from './infraestructure/transaction.resolver';
import { TransactionService } from './application/transaction.service';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    })
  ],
  providers: [TransactionResolver, TransactionService],
})
export class TransactionModule { }
