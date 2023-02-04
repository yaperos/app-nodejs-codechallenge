import {Module} from '@nestjs/common';

import {GraphQLModule} from '@nestjs/graphql';
import {ApolloDriver} from '@nestjs/apollo';
import {join} from 'path'
import {TransactionModule} from './transaction/transaction.module'

@Module({
  imports: [
    TransactionModule,
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
