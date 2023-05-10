import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [
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
