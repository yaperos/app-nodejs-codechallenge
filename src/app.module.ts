import { Module } from '@nestjs/common';
import {GraphQLModule} from '@nestjs/graphql'
import {ApolloDriverConfig, ApolloDriver} from '@nestjs/apollo'
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceConfig } from './config/data.source';
import { TransactionsModule } from './transactions/transactions.module';
import { join } from 'path';
import { KafkaModule } from './kafka/kafka.module';
import { TestConsumer } from './tet.consumer';
import { TransactionsService } from './transactions/services/transactions.service';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({ ...DataSourceConfig }),
    TransactionsModule,
    KafkaModule
  ],
  providers: [TestConsumer,TransactionsService]
  
})
export class AppModule {}
