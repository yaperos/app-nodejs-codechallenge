import { Injectable, OnModuleInit } from "@nestjs/common"
import { ConsumerService } from "../../kafka/consumer.service";
import { TransactionRejectedEvent } from "../../event";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class TransactionRejectedConsumer implements OnModuleInit {
    constructor(private readonly consumerService: ConsumerService, private prisma: PrismaService) { }

    async onModuleInit() {
        await this.consumerService.consume({
            topics: ['transaction-approved', 'transaction-rejected']
        }, {
            eachMessage: async ({ topic, partition, message }) => {
                const topicName = topic.toString();
                console.log({
                    topic: topicName,
                    partition: partition.toString(),
                    value: message.value.toString()
                })
                const event = JSON.parse(message.value.toString()) as TransactionRejectedEvent;

                const transaction = await this.prisma.transaction.findUnique({
                    where: {
                        externalId: event.transactionExternalId
                    }
                })

                if (transaction) {
                    let statusName: string;
                    if(topicName == 'transaction-approved') {
                        statusName = "approved"
                    } else if(topicName == 'transaction-rejected') {
                        statusName = "rejected"
                    }
                    const status = await this.prisma.transactionStatus.findFirst({
                        where: {
                            name: {
                                equals: statusName,
                                mode: "insensitive"
                            }
                        }
                    })
                    await this.prisma.transaction.update({
                        where: {
                            externalId: event.transactionExternalId
                        },
                        data: {
                            statusId: status.id
                        }
                    })
                }
            }
        })
    }
}