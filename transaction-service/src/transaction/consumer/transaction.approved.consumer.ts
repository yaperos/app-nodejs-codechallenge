import { Injectable, OnModuleInit } from "@nestjs/common"
import { ConsumerService } from "../../kafka/consumer.service";
import { TransactionApprovedEvent } from "../../event";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class TransactionApprovedConsumer implements OnModuleInit {
    constructor(private readonly consumerService: ConsumerService, private prisma: PrismaService) { }

    async onModuleInit() {
        await this.consumerService.consume({
            topics: ['transaction-approved']
        }, {
            eachMessage: async ({ topic, partition, message }) => {
                console.log({
                    topic: topic.toString(),
                    partition: partition.toString(),
                    value: message.value.toString()
                })
                const event = JSON.parse(message.value.toString()) as TransactionApprovedEvent;

                const transaction = await this.prisma.transaction.findUnique({
                    where: {
                        externalId: event.transactionExternalId
                    }
                })

                if (transaction) {
                    const approvedStatus = await this.prisma.transactionStatus.findFirst({
                        where: {
                            name: {
                                equals: "approved",
                                mode: "insensitive"
                            }
                        }
                    })
                    await this.prisma.transaction.update({
                        where: {
                            externalId: event.transactionExternalId
                        },
                        data: {
                            statusId: approvedStatus.id
                        }
                    })
                }
            }
        })
    }
}