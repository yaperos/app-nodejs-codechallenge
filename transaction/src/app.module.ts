import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { GraphqlModule } from './graphql/graphql.module';
import { config, validationSchema, environments } from './config';
import { TransactionsModule } from './transactions/transactions.module';
import { KafkaModule } from './kafka/kafka.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: environments[`${process.env.NODE_ENV}`],
      ignoreEnvFile: process.env.NODE_ENV === 'production' || false,
      load: [config],      
      validationSchema
    }),
    DatabaseModule,
    GraphqlModule,    
    KafkaModule,
    TransactionsModule,
  ],
})
export class AppModule {}
