import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransactionModule } from './transaction/transaction.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig} from '@nestjs/apollo';
import {join} from 'path';
import { TypeOrmModule} from '@nestjs/typeorm';
import { DataSourceConfig} from './config/data.source'
import { TranferTypeModule } from './tranfer-type/tranfer-type.module';
import { TransactionStatusModule } from './transaction-status/transaction-status.module';
import { KafkaModule } from './kafka/kafka.module';


@Module({
  imports: [    
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver:ApolloDriver,     
      autoSchemaFile: join(process.cwd(),'src/schema/schema.gql')
    }),    
    TypeOrmModule.forRoot({...DataSourceConfig}),
    TransactionModule,
    TranferTypeModule,
    TransactionStatusModule,    
    KafkaModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
