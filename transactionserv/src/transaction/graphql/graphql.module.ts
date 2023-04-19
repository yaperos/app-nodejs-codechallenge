import { join } from 'path';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TransactionModule } from '../transaction.module';


@Module({
  imports: [
    TransactionModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/transaction/graphql/schema.gql'),
      playground: true,
      introspection: true,
      }),
  ],
  controllers: [],
  providers: []
})
export class graphqlmodule {}
