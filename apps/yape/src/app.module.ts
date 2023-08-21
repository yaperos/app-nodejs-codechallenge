import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TransactionModule } from './infra/resolver/transaction/transaction.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.dev.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      synchronize: true, //only for dev enviroment
      retryAttempts: 3,
      autoLoadEntities: true,
      replication: {
        master: {
          host: process.env.DB_MASTER_HOST,
          port: +process.env.DB_MASTER_PORT,
          username: process.env.DB_MASTER_USERNAME,
          password: process.env.DB_MASTER_PASSWORD,
          database: process.env.DB_MASTER_DATABASE
        },
        slaves: [{
          host: process.env.DB_REPLICA_HOST,
          port: +process.env.DB_REPLICA_PORT,
          username: process.env.DB_REPLICA_USERNAME,
          password: process.env.DB_REPLICA_PASSWORD,
          database: process.env.DB_REPLICA_DATABASE
        }]
      }
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: true
    }),
    TransactionModule
  ]
})
export class AppModule { }
