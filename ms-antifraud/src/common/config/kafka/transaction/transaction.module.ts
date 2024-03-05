import { Module } from "@nestjs/common";
import { ClientsModule } from "@nestjs/microservices";
import { EnvironmentModule, EnvironmentService } from "../../environment";
import { TransactionKafkaConfigService } from "./transaction.config";

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: process.env.TRANSACTION_KAFKA_NAME,
        imports: [EnvironmentModule],
        useClass: TransactionKafkaConfigService,
      }
    ]),
  ],
  exports: [ClientsModule],
})
export class TransactionKafkaModule {};