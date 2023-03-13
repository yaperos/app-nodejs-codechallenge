import { Module } from "@nestjs/common";
import { ValidationService } from "./validation.service";
import { Config } from "src/config/config.module";
import { ConfigService } from "@nestjs/config";
import { KafkaModule } from "src/kafka/kafka.module";
import { ValidationRequestConsumer } from "./events/ValidationRequestConsumer";

@Module({
    imports: [
        Config,
        KafkaModule
    ],
    providers: [
        ConfigService,
        ValidationService,
        ValidationRequestConsumer,
    ],
})
export class ValidationModule {}
