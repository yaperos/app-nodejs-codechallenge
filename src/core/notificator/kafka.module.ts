import { Module } from "@nestjs/common";
import { ProducerService } from "./producer/producer.service";
import { ConsumerService } from "./consumer/consumer.service";


@Module({
    imports:[],
    providers:[ProducerService, ConsumerService],
    exports:[ProducerService, ConsumerService]
})

export class KafkaModule {}