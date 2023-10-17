import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { CreateTransactionHandler } from './application/handlers/create-transaction.handler';
import { GetTransactionHandler } from './application/handlers/get-transaction.handler';
import { TransactionRepository } from './domain/transaction.repository';
import { Transaction } from './infraestructure/entities/transaction.entity';
import { TransactionResolver } from './infraestructure/transaction.resolver';
import { TypeOrmRepository } from './infraestructure/type-orm.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]),
    CqrsModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'apps/transaction/src/schema.gql'),
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.HOST,
        port: Number(process.env.POSTGRES_PORT),
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB,
        entities: [Transaction],
        synchronize: true // Esto crea las tablas automáticamente (NO usar en producción)
      }),
    }),
  ],
  providers: [TransactionResolver, CreateTransactionHandler, GetTransactionHandler,
    {
      provide: TransactionRepository,
      useClass: TypeOrmRepository,
    }],
})
export class TransactionModule { }
