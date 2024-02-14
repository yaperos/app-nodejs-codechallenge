import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Transaction } from '../common/entities/transaction.entity';
import { TransactionResolver } from './resolvers/transaction.resolver';
import { TransactionService } from '../transactions/services/transaction.service';
import { KafkaProducerService } from '../kafka/services/kafka-producer.service';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
    }),
    TypeOrmModule.forFeature([Transaction]),
  ],
  providers: [TransactionResolver, TransactionService, KafkaProducerService],
})
export class GraphqlModule {}
