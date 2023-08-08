import { Module } from '@nestjs/common';
import { TransactionController } from './controllers/transaction.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { DatabaseModule } from './database/database.module';
import { Transaction, TransactionStatus, TransactionType } from './models';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import {
  TransactionResolver,
  TransactionStatusResolver,
  TransactionTypeResolver,
} from './resolvers';
import {
  TransactionService,
  TransactionStatusService,
  TransactionTypeService,
} from './services';

@Module({
  //imports: [TypeOrmModule.forFeature([Transaction])],
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      //autoSchemaFile: true,
    }),
    TypeOrmModule.forFeature([Transaction, TransactionStatus, TransactionType]),
    ClientsModule.register([
      {
        name: 'MS_ANTIFRAUD',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'transaction',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'transaction-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [TransactionController],
  providers: [
    TransactionService,
    TransactionStatusService,
    TransactionTypeService,
    TransactionResolver,
    TransactionStatusResolver,
    TransactionTypeResolver,
  ],
})
export class AppModule {
  static port: number;

  constructor(private readonly configService: ConfigService) {
    AppModule.port = +this.configService.get('APP_PORT');
  }
}
