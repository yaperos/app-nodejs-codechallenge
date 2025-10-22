import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bull";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { AntifraudService } from "../../application/services/antifraud.service";
import { AntifraudProcessor } from "../../application/processors/antifraud.processor";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TransactionEntity } from "../database/entities/transaction.entity";
import { TransactionRepository } from "../database/repositories/transaction.repository";

@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionEntity]),
    BullModule.registerQueue({
      name: "antifraud",
      defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: false,
      },
    }),
    BullModule.registerQueue({
      name: "transactions",
    }),
    ClientsModule.register([
      {
        name: "KAFKA_SERVICE",
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: "antifraud-service",
            brokers: [process.env.KAFKA_BROKERS || "localhost:9092"],
          },
          consumer: {
            groupId: "antifraud-group",
          },
        },
      },
    ]),
  ],
  providers: [
    AntifraudService,
    AntifraudProcessor,
    {
      provide: "ITransactionRepository",
      useClass: TransactionRepository,
    },
  ],
  exports: [AntifraudService],
})
export class AntifraudModule {}
