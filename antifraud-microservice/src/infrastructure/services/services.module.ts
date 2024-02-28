import { Module } from "@nestjs/common";
import { LoggerService } from "../logger/logger.service";
import { KafkaConfigModule } from "../config/kafka/kafka.module";
import { AntifraudService } from "./antifraud.service";

@Module({
    imports: [KafkaConfigModule],
    providers: [AntifraudService, LoggerService],
    exports: [AntifraudService],
  })
export class ServicesModule {}