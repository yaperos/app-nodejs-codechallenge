import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { TransactionModule } from './transaction/transaction.module';
import { TransactionTypeModule } from './transaction-type/transaction-type.module';
import { TransactionStatusModule } from './transaction-status/transaction-status.module';
import { GraphQLError, GraphQLFormattedError } from 'graphql';
import { TransactionValidationModule } from './transaction-validation/transaction-validation.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/gql/schema.gql'),
      formatError: (error: GraphQLError) => {
        const graphQLFormattedError: GraphQLFormattedError = {
          message: error.message,
        };
        return graphQLFormattedError;
      },
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'challenge',
      synchronize: true,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      schema: 'challenge_schema',
    }),
    TransactionModule,
    TransactionTypeModule,
    TransactionStatusModule,
    TransactionValidationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [AppService],
})
export class AppModule {}
