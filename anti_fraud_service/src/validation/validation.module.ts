import { Module } from "@nestjs/common";
import { ValidationService } from "./validation.service";
import { Config } from "src/config/config.module";
import { ConfigService } from "@nestjs/config";
import { KafkaModule } from "src/kafka/kafka.module";
import { TransactionCreatedConsumer } from "./events/TransactionCreatedConsumer";

@Module({
    imports: [
        Config,
        KafkaModule
    ],
    providers: [
        ConfigService,
        ValidationService,
        TransactionCreatedConsumer,
    ],
})
export class ValidationModule {}
