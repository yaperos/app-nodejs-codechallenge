import { Module } from '@nestjs/common';
import { HealthModule } from './application/useCases/health/health.module';
import { LoggerModule } from './application/useCases/logger/logger.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfig } from './infraestructure/database/config';
import { TransactionModule } from './application/useCases/transaction/createTransaction/transaction.module';
import { AntiFraudModule } from './application/useCases/antiFraud/logger.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLConfig } from './infraestructure/graphql/grapghql';
import { GetTransactionModule } from './application/useCases/transaction/getTransaction/transaction.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>(GraphQLConfig),
    TypeOrmModule.forRoot(DatabaseConfig),
    HealthModule,
    LoggerModule,
    GetTransactionModule,
    TransactionModule,
    AntiFraudModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
