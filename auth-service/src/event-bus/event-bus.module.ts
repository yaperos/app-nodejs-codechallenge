import {Module} from "@nestjs/common";
import {ConfigModule} from "@nestjs/config";
import {EventBusKafka} from "./kafa.event-bus";

@Module({
    imports: [ConfigModule],
    providers: [EventBusKafka],
    exports: [EventBusKafka],
})

export class EventBusModule {}