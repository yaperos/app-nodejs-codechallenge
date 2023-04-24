import { ConfigModule } from "./config/env/config.module";
import { TracerModule } from "./config/tracer/tracer.module";
import { HttpModule } from "./http/HttpModule";
import { Module } from "@nestjs/common";
import { LoggerModule } from "./config/logger/logger.module";
import { AntifraudModule } from "./contexts/antifraud/antifraud.module";
import { APP_FILTER } from "@nestjs/core";
import { AllExceptionsFilter } from "./config/bus/kafka.exception";
import { KafkaProcessorModule } from "./config/bus/kafka/kafkaProcessor/KafkaProcessorModule";

@Module({
  imports: [
    LoggerModule,
    ConfigModule,
    TracerModule,
    HttpModule,
    AntifraudModule,
    KafkaProcessorModule
  ],
  controllers: [],
  providers: [{
    provide: APP_FILTER,
    useClass: AllExceptionsFilter,
  },],
})
export class AppModule {}
