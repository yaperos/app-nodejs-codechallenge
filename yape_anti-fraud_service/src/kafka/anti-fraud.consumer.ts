import { Injectable, OnModuleInit } from "@nestjs/common";
import { ConsumerService } from "./consumer.service";

@Injectable()
export class AntiFraudConsumer implements OnModuleInit {
    constructor(private readonly consumerService: ConsumerService) { }
    async onModuleInit() {
        this.consumerService.consume({ topic: 'test' }, {
            eachMessage: async ({ topic, partition, message }) => {
                console.log({
                    value: message.value.toString(),
                    topic: topic.toString(),
                    partition: partition.toString()
                });
            }
        });
    }

}