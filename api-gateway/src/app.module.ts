import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransactionsModule } from './transactions/transactions.module';
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { join } from 'path';
import { TransfertypesModule } from './transfertypes/transfertypes.module';
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from '@nestjs/config';
import { configLoader } from './config/config-loader';
import { KafkaModule } from './kafka/kafka.module';
import { TransactionstatusModule } from './transactionstatus/transactionstatus.module';
import * as redisStore from 'cache-manager-redis-store';
import type { RedisClientOptions } from 'redis';

const db = configLoader().database
@Module({
  imports: [
    CacheModule.register<RedisClientOptions>({
      store: redisStore,
      host: "redis",
      port: 6379
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), "src/schema.gql")
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: db.host,
      port: Number(db.port),
      username: db.username,
      password:  db.password,
      database:  db.username,
      entities: [ __dirname + '/**/*.entity{.ts,.js}',],
      synchronize: true
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configLoader]
    }),
    TransactionsModule,
    TransfertypesModule,
    KafkaModule,
    TransactionstatusModule

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
