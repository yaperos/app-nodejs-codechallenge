import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { AfterCreateTransactionCommandHandler } from './application/commands/after-create-transaction.command';
import { AfterUpdateTransactionCommandHandler } from './application/commands/after-update-trasaction.command';
import { CreateTransactionCommandHandler } from './application/commands/create-transaction.command';
import { UpdateTransactionCommandHandler } from './application/commands/update-trasaction.command';
import { HelloWorldService } from './application/services/hello-world.service';
import { RetrieveTransactionQueryHandler } from './application/queries/retrieve-transaction.query';
import { TransactionModel } from './infrastructure/models/transaction.model';
import { TransferTypeModel } from './infrastructure/models/transfer-type.model';
import { DBTransactionRespository } from './infrastructure/repositories/db-transaction.repository';
import { DBTransferTypeRepository } from './infrastructure/repositories/db-transfer-type.repository';
import {
  Transaction,
  TransactionSchema,
} from './infrastructure/schemas/transaction.schema';
import { CreateTransactionController } from './interfaces/http/create-transaction/create-transaction.controller';
import { HelloWorldController } from './interfaces/http/hello-world/hello-world.controller';
import { RetrieveTransactionController } from './interfaces/http/retrieve-transaction/retrieve-transaction.controller';
import { TransactionCreatedListener } from './interfaces/listeners/transaction-created/transaction-created.listener';
import { TransactionUpdatedListener } from './interfaces/listeners/transaction-updated/transaction-updated.listener';
import { TransactionValidatedListener } from './interfaces/listeners/transaction-validated/transaction-validated.listener';
import * as databaseConfig from '../config/database.config';
import * as kafkaConfig from '../config/kafka.config';
import * as mongoConfig from '../config/mongo.config';
import { DocumentTransactionRepository } from './infrastructure/repositories/document-transaction.repository';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TransactionResolver } from './interfaces/graphql/resolvers/transaction.resolver';

const imports = [
  ClientsModule.register([
    {
      name: 'ANTIFRAUD_SERVICE',
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: kafkaConfig.KAFKA_ANTIFRAUD_CLIENT_ID,
          brokers: [kafkaConfig.KAFKA_BROKER],
        },
        consumer: {
          groupId: kafkaConfig.KAFKA_ANTIFRAUD_GROUP_ID,
        },
      },
    },
  ]),
  CqrsModule,
  GraphQLModule.forRoot<ApolloDriverConfig>({
    autoSchemaFile: true,
    driver: ApolloDriver,
  }),
  MongooseModule.forRoot(mongoConfig.MONGODB_URI),
  MongooseModule.forFeature([
    { name: Transaction.name, schema: TransactionSchema },
  ]),
  TypeOrmModule.forRoot({
    type: 'postgres',
    host: databaseConfig.DB_HOST,
    port: databaseConfig.DB_PORT,
    username: databaseConfig.DB_USER,
    password: databaseConfig.DB_PASS,
    database: databaseConfig.DB_NAME,
    autoLoadEntities: true,
    synchronize: true,
  }),
  TypeOrmModule.forFeature([TransactionModel, TransferTypeModel]),
];

const controllers = [
  HelloWorldController,
  CreateTransactionController,
  RetrieveTransactionController,
];

const services = [AppService, HelloWorldService];

const commands = [
  AfterCreateTransactionCommandHandler,
  AfterUpdateTransactionCommandHandler,
  CreateTransactionCommandHandler,
  UpdateTransactionCommandHandler,
];

const queries = [RetrieveTransactionQueryHandler];

const repositories = [
  {
    provide: 'TransactionRepositoryImplement',
    useClass: DBTransactionRespository,
  },
  {
    provide: 'TransferTypeRepositoryImplement',
    useClass: DBTransferTypeRepository,
  },
  {
    provide: 'DocumentTransactionRepository',
    useClass: DocumentTransactionRepository,
  },
];

const listeners = [
  TransactionValidatedListener,
  TransactionCreatedListener,
  TransactionUpdatedListener,
];

const resolvers = [TransactionResolver];

@Module({
  imports: [...imports],
  controllers: [...controllers, ...listeners],
  providers: [
    ...commands,
    ...repositories,
    ...resolvers,
    ...services,
    ...queries,
  ],
})
export class AppModule {}
