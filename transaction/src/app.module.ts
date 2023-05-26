import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsModule } from './transactions/transactions.module'
import { ApolloDriver } from '@nestjs/apollo';
import { TransactionsService } from './transactions/transactions.service';
import { TransactionType } from './transactions/entities/transaction-type.entity';
import { Transaction } from './transactions/entities/transaction.entity';
import { TransactionStatus } from './transactions/entities/transaction-status.entity';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: './schema.gql',
      debug: true,
      playground: true,
      driver: ApolloDriver,
    }),
    TypeOrmModule.forRoot({
      keepConnectionAlive: true,
      type: 'postgres',
      host: 'db-postgres',
      port: 5432,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: 'postgres',
      autoLoadEntities: true,
      synchronize: false,
      entities: ['dist/transactions/**/*.entity.{ts,js}'],
      migrations: ['dist/migrations/*.{ts,js}'],
      migrationsRun: false,
    }),
    TypeOrmModule.forFeature([TransactionType, TransactionStatus, Transaction]),
    TransactionsModule,
  ],
  controllers: [AppController],
  providers: [AppService, TransactionsService],
})
export class AppModule { }