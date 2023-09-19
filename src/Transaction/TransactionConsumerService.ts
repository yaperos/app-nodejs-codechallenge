import { Injectable, OnModuleInit } from "@nestjs/common";
import { TransactionConsumer } from "../Transaction/TransactionConsumer";
import { TransactionProcessDto } from "src/dtos/TransactionProcessDto";
import { TransactionService } from "src/services/transaction.service";
import { TransactionEntity } from "src/entities/transaction.entity";

@Injectable()
export class TransactionConsumerService implements OnModuleInit {
    constructor(
        private readonly consumerService: TransactionConsumer
        ,     private readonly transactionService :TransactionService,
        ) { }

    async onModuleInit() {

        await this.consumerService.consume(
            { topics: ['update-status-transaction-event'] },
            {
                eachMessage: async ({ topic, partition, message }) => {

                    let transaccion = <TransactionEntity>JSON.parse(message.value.toString())

                    console.log(
                        {
                            type: 'antifraud to transaction',
                            result: transaccion
                        }
                    )
                    let result = await this.transactionService.update(transaccion)

                }

            }
        )
    }




}