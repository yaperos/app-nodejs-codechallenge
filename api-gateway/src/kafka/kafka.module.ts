import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { KafkaClientModule } from "./Kafka";
import { KafkaService } from "./kafka.service";

@Module({
    imports:[ ConfigModule, KafkaClientModule,  ],
    providers: [KafkaService],
    exports: [KafkaService]
})
export class KafkaModule {}