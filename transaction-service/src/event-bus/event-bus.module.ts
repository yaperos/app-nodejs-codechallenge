import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { KafkaEventBus } from "./kafka.event-bus";

@Module({
  imports: [ConfigModule],
  providers: [KafkaEventBus],
  exports: [KafkaEventBus],
})
export class EventBusModule {}
