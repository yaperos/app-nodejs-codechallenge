import { Injectable, OnModuleInit } from "@nestjs/common";
import { ConsumerService } from "./kafka/consumer.service";
import { TransactionApprovedEvent, TransactionCreatedEvent, TransactionRejectedEvent } from "./event";
import { ProducerService } from "./kafka/producer.service";

@Injectable()
export class TransactionCreatedConsumer implements OnModuleInit {
    constructor(private readonly consumerService: ConsumerService, private readonly producer: ProducerService) { }

    async onModuleInit() {
        await this.consumerService.consume({
            topics: ['transaction-created']
        }, {
            eachMessage: async ({ topic, partition, message }) => {
                console.log({
                    topic: topic.toString(),
                    partition: partition.toString(),
                    value: message.value.toString()
                })
                const transactionCreatedEvent = JSON.parse(message.value.toString()) as TransactionCreatedEvent

                // anti-fraud logic
                if (transactionCreatedEvent.value > 1000) {
                    const event: TransactionRejectedEvent = {
                        transactionExternalId: transactionCreatedEvent.transactionExternalId,
                        value: transactionCreatedEvent.value,
                        rejectedAt: new Date()
                    }
                    console.log("Rejected")
                    this.producer.produce({
                        topic: 'transaction-rejected',
                        messages: [
                            {
                                value: JSON.stringify(event)
                            }
                        ]
                    })
                }
                else {
                    const event: TransactionApprovedEvent = {
                        transactionExternalId: transactionCreatedEvent.transactionExternalId,
                        value: transactionCreatedEvent.value,
                        approvedAt: new Date()
                    }
                    this.producer.produce({
                        topic: 'transaction-approved',
                        messages: [
                            {
                                value: JSON.stringify(event)
                            }
                        ]
                    })
                }
            }
        })
    }
}