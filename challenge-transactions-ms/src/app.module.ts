import { HttpModule } from '@nestjs/axios';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { TerminusModule } from '@nestjs/terminus';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import { HealthcheckController } from './module/interfaces/http/healthcheck.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TransactionVerifyEntity } from './module/infrastructure/entities/transaction-verify.entity';
import { TransactionVerifyTypeEntity } from './module/infrastructure/entities/transaction-verify-type.entity';
import { TransactionVerifyStatusEntity } from './module/infrastructure/entities/transaction-verify-status.entity';
import { TransactionVerifyController } from './module/interfaces/http/v1/transaction/transaction-verify.controller';
import { SaveTransactionVerifyCommandHandler } from './module/application/command/save-transaction-verify-event.command';
import { TransactionVerifyInfrastructure } from './module/infrastructure/transacion-verify.infrastructure';
import { UpdateTransactionVerifyEventCommandHandler } from './module/application/command/update-transaction-verify-event.command';
import { GetTransactionVerifyEventCommandHandler } from './module/application/query/get-transaction-verify-event.query';

const imports = [
  ConfigModule.forRoot(),
  CqrsModule,
  HttpModule,
  TerminusModule,
  TypeOrmModule.forRoot({
    type: 'postgres',
    host: process.env.HOST_ORM,
    port: parseInt(process.env.PORT_ORM),
    username: process.env.USERNAME_ORM,
    password: process.env.PASSWORD_ORM,
    database: process.env.DATABASE_ORM,
    entities: [
      TransactionVerifyEntity,
      TransactionVerifyTypeEntity,
      TransactionVerifyStatusEntity,
    ],
    synchronize: true,
  }),
  TypeOrmModule.forFeature([
    TransactionVerifyEntity,
    TransactionVerifyTypeEntity,
    TransactionVerifyStatusEntity,
  ]),
  ClientsModule.register([
    {
      name: process.env.CLIENT_MODULE_REGISTER,
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: [process.env.BROKER],
        },
        consumer: {
          groupId: process.env.GROUP_ID,
        },
      },
    },
  ]),
];

const controllers = [TransactionVerifyController, HealthcheckController];

const providersFactory = [];
const providersApplication = [
  SaveTransactionVerifyCommandHandler,
  UpdateTransactionVerifyEventCommandHandler,
  GetTransactionVerifyEventCommandHandler,
];
const providersInfrastructure = [TransactionVerifyInfrastructure];
@Module({
  imports: [...imports],
  controllers: [...controllers],
  providers: [
    Logger,
    AppService,
    ...providersFactory,
    ...providersApplication,
    ...providersInfrastructure,
  ],
})
export class AppModule {
  static port: number | string;

  constructor(private readonly configService: ConfigService) {
    AppModule.port = this.configService.get('PORT') || 80;
  }
}
