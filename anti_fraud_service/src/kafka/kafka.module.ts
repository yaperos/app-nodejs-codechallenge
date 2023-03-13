import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ConsumerService } from "./consumer/consumer.service";
import { ProducerService } from "./producer/producer.service";

@Module({
    providers: [ConfigService, ConsumerService, ProducerService],
    exports: [ConsumerService, ProducerService],
})
export class KafkaModule {}
