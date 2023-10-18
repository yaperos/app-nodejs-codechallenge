import { Module } from '@nestjs/common';
import { TransactionModule } from './transactions/transaction.module';
import { join } from 'path';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: true,
      // plugins: [ApolloServerPluginLandingPageLocalDefault()],
    }),
    TransactionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
