import { Module } from "@nestjs/common";
import { TransactionController } from "./controller/transaction.controller";
import { TransactionService } from "./service/transaction.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TransactionTypeService } from "./service/transaction-type/transaction-type.service";
import { TransactionEntity } from "./entity/transaction.entity";
import { TransactionMapper } from "./mapper/transaction.mapper";
import { TransactionTypeEntity } from "./entity/transaction-type.entity";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { MongooseModule } from "@nestjs/mongoose";
import { TransactionReadEntity, TransactionSchema } from "./entity/transaction-read.entity";
import { CreateTransactionEventHandler } from "./events/handlers/create-transaction-event.handler";
import { CreateTransactionCommandHandler } from "./commands/handlers/create-transaction-command.handler";
import { FindTransactionQueryHandler } from "./queries/handlers/find-transaction.query.handler";
import { TransactionReadService } from "./service/transaction-read.service";
import { CqrsModule } from "@nestjs/cqrs";
import { UpdateStatusTransactionEventHandler } from "./events/handlers/update-status-transaction-event.handler";
import { UpdateStatusTransactionCommandHandler } from "./commands/handlers/update-status-transaction-command.handler";

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([TransactionEntity, TransactionTypeEntity]),
    MongooseModule.forFeature([{ name: TransactionReadEntity.name, schema: TransactionSchema }]),
    ClientsModule.register([
      {
        name: 'antifraud-client',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['localhost:9092'],
          }, consumer: {
            groupId: 'anti-fraud-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [TransactionController],
  providers: [
    TransactionService,
    TransactionTypeService,
    TransactionReadService,
    TransactionMapper,
    CreateTransactionEventHandler,
    CreateTransactionCommandHandler,
    FindTransactionQueryHandler,
    UpdateStatusTransactionCommandHandler,
    UpdateStatusTransactionEventHandler
  ],
})
export class TransactionModule {}
