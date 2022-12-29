import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { configValidationSchema } from './config.schema';
import { TransactionController } from './interfaces/http/transaction.controller';
import { CreateTransactionCommandHandler } from './application/commands/create-transaction.command';
import { CqrsModule } from '@nestjs/cqrs';
import { TransactionInfrastructure } from './infrastructure/transaction.infrastructure';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UpdateTransactionCommandHandler } from './application/commands/update-transaction.command';
import { GetTransactionQueryHandler } from './application/queries/get-transaction.query';

const controllers = [TransactionController];
const domain = [];
const application = [
  CreateTransactionCommandHandler,
  UpdateTransactionCommandHandler,
  GetTransactionQueryHandler,
];
const infrastructure = [TransactionInfrastructure];

@Module({
  imports: [
    CqrsModule,
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE}`],
      validationSchema: configValidationSchema,
    }),
    ClientsModule.register([
      {
        name: 'TRANSACTION_EMITTER',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'transaction-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [...controllers],
  providers: [AppService, ...domain, ...application, ...infrastructure],
})
export class AppModule {}
