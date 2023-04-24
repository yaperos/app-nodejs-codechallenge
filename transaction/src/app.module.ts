
import { HttpModule } from './http/HttpModule';
import { TracerModule } from './config/tracer/tracer.module';
import { ConfigModule } from './config/env/config.module';
import { LoggerModule } from './config/logger/logger.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmOptions } from '@/config/orm/TypeOrmOptions';
import { KafkaProcessorModule } from '@/config/bus/kafka/kafkaProcessor/KafkaProcessorModule';
import { AntifraudModule } from '@/contexts/antifraud/antifraud.module';
import { GraphQLModule } from "@nestjs/graphql";
import { TransactionResolver } from "@/contexts/graphql/TransactionResolver";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";


@Module({
  imports: [
    LoggerModule,
    TypeOrmModule.forRootAsync({
      name: 'DB_SERVER_POSTGRES',
      useClass: TypeOrmOptions,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
    }),
    ConfigModule,
    TracerModule,
    HttpModule,
    KafkaProcessorModule,
    AntifraudModule
  ],
  controllers: [],
  providers: [TransactionResolver],
})
export class AppModule {}
