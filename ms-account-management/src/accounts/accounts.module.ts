import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  MongoAccount,
  MongoAccountSchema,
} from './infrastructure/entity/mongo-account';
import { CreateAccountImpl } from './application/use-case/create-account-impl';
import { MongoAccountRepository } from './infrastructure/repository/mongo-account.repository';
import { CreateAccountController } from './infrastructure/rest/create-account.controller';
import { FindAccountController } from './infrastructure/rest/find-account.controller';
import { FindAccountImpl } from './application/use-case/find-account-impl';
import { UpdateAccountController } from './infrastructure/rest/update-account.controller';
import { UpdateAccountImpl } from './application/use-case/update-account-impl';
import { BlockAccountEvent } from './infrastructure/event/block-account.event';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['localhost:9092'],
          },
        },
      },
    ]),
    MongooseModule.forFeature([
      { name: MongoAccount.name, schema: MongoAccountSchema },
    ]),
  ],
  controllers: [
    BlockAccountEvent,
    CreateAccountController,
    FindAccountController,
    UpdateAccountController,
  ],
  providers: [
    {
      provide: 'ACCOUNT_REPOSITORY',
      useClass: MongoAccountRepository,
    },
    {
      provide: 'CREATE_ACCOUNT',
      useClass: CreateAccountImpl,
    },
    {
      provide: 'FIND_ACCOUNT',
      useClass: FindAccountImpl,
    },
    {
      provide: 'UPDATE_ACCOUNT',
      useClass: UpdateAccountImpl,
    },
  ],
})
export class AccountsModule {}
