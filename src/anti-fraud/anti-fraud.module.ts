import { Module } from "@nestjs/common";
import { AntiFraudService } from "./anti-fraud.service";
import { KafkaModule } from "@core/notificator";
@Module({
    imports: [KafkaModule],
    providers:[AntiFraudService],
    exports: [AntiFraudService]
})

export class AntiFraudeModule {}