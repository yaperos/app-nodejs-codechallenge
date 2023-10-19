import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { GraphQLModule } from '@nestjs/graphql';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { CreateTransactionHandler } from './application/handlers/create-transaction.handler';
import { TransactionEventHandler } from './application/handlers/transaction-event.handler';
import { TransactionRepository } from './domain/repositories/transaction.repository';
import { TransactionEntity } from './infraestructure/entities/transaction.entity';
import { TypeOrmRepository } from './infraestructure/repository/type-orm.repository';
import { TransactionResolver } from './infraestructure/transaction.resolver';

@Module({
  imports: [
    ConfigModule.forRoot({ expandVariables: true }),
    TypeOrmModule.forFeature([TransactionEntity]),
    ClientsModule.registerAsync([
      {
        name: 'KAFKA_CLIENT',
        useFactory: () => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              brokers: [process.env.BROKER],
              retry: {
                retries: 5, // Número máximo de reintentos
                multiplier: 2, // Factor multiplicador para los tiempos de espera entre reintentos
                initialRetryTime: 1000, // Tiempo de espera mínimo entre reintentos (en milisegundos)
                maxRetryTime: 3000, // Tiempo de espera máximo entre reintentos (en milisegundos)
                factor: 0.2, // Agregar aleatZoriedad a los tiempos de espera
              }
            },
            consumer: {
              groupId: process.env.GROUP_WRITE_TRANSACTION
            }
          }
        }),
      }
    ]),
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
        entities: [TransactionEntity],
        synchronize: true // Esto crea las tablas automáticamente (NO usar en producción)
      }),
    })
  ],
  providers: [TransactionResolver, CreateTransactionHandler, TransactionEventHandler,
    {
      provide: TransactionRepository,
      useClass: TypeOrmRepository,
    }],
  controllers: [TransactionResolver]
})
export class WriteTransactionModule { }
