import { Module } from "@nestjs/common";
import { ClientsModule } from "@nestjs/microservices";
import { EnvironmentModule } from "../../environment";
import { AntifraudKafkaConfigService } from "./antifraud.config";
import { CustomConfigModule } from "../../custom-config";

@Module({
  imports: [
    CustomConfigModule,
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