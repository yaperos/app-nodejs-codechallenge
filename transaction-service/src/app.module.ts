import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import {TypeOrmModule} from '@nestjs/typeorm';
import { join } from 'path';
import { KafkaModule } from './kafka/kafka.module';
import { ConfigModule } from '@nestjs/config';
import { TransactionsModule } from './transactions/infrastructure/transactions.module';
import { ProducerService } from './kafka/producer.service';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql')
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      database: 'postgres',
      host: 'localhost',
      port: 5432,
      password: 'postgres',
      username: 'postgres',
      entities: [__dirname + '/**/*.entity.{js,ts}'],
      synchronize: true,
      logging: true,
    }),
    TransactionsModule,
    KafkaModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'IProducerService',
      useClass: ProducerService
    },
  ],
})

export class AppModule {}
