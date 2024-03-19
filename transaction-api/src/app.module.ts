import { join } from 'path';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TransactionsModule } from './transactions/transactions.module';
import { KafkaModule } from './transactions/kafka/kafka.module';
import { KafkaConsumer } from './transactions/kafka/kafka.consumer';
import { TransactionsService } from './transactions/transactions.service';
import { Transaction } from './transactions/entity/transaction.entity';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
    TypeOrmModule.forFeature([
      Transaction
    ]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'postgres_db',
      entities: [join(__dirname, '**', '*.entity.{ts,js}')],
      synchronize: true,
    }),
    TransactionsModule,
    KafkaModule
  ],
  controllers: [],
  providers: [KafkaConsumer, TransactionsService],
})
export class AppModule { }
