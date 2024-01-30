import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { TransactionModule } from './modules/transaction/infrastructure/presentation/transaction.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { HealthModule } from "./modules/health/health.module"
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: true,
      autoSchemaFile: true,
    }),
    TransactionModule,
    HealthModule,
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10,
    }]),
    ConfigModule.forRoot()
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
