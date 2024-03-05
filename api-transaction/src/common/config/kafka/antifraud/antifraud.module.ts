import { Module } from "@nestjs/common";
import { ClientsModule } from "@nestjs/microservices";
import { EnvironmentModule } from "../../environment";
import { AntifraudKafkaConfigService } from "./antifraud.config";

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: process.env.ANTIFRAUD_KAFKA_NAME,
        imports: [EnvironmentModule],
        useClass: AntifraudKafkaConfigService,
      }
    ]),
  ],
  exports: [ClientsModule],
})
export class AntifraudKafkaModule {};