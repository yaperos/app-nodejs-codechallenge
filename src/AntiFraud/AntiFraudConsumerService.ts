import { Injectable, OnModuleInit } from "@nestjs/common";
import { AntiFraudConsumer } from "./AntiFraudConsumer";
import { TransactionInputDto } from "src/dtos/TransactionInputDto";
import { TransactionProducer } from "src/Transaction/TransactionProducer";
import { TransactionEntity } from "src/entities/transaction.entity";

@Injectable()
export class AntiFraudConsumerService implements OnModuleInit {
    constructor(
        private readonly consumerService: AntiFraudConsumer
        , private readonly producerService: TransactionProducer
    ) { }

    async onModuleInit() {

        // Consume Data with Spcific topic

        await this.consumerService.consume(
            { topics: ['created-transaction-event'] },
            {
                eachMessage: async ({ topic, partition, message }) => {

                    let transaccion = <TransactionEntity>JSON.parse(message.value.toString())

                    let resultAntiFraud = "approved"
                    if (transaccion.value > 1000) {
                        resultAntiFraud = "rejected"
                    }

                    let resultTransaccion = {
                        id: transaccion.id,
                        transactionExternalId: transaccion.transactionExternalId,
                        transactionStatus: resultAntiFraud,                        
                        value: transaccion.value
                    }

                    console.log(
                        {
                            type: 'transaccion to antifraud',
                            result: transaccion
                        }
                    )


                    //Enviando el evento
                    this.producerService.produce({
                        topic: 'update-status-transaction-event',
                        messages: [{
                            value: JSON.stringify(resultTransaccion)
                        }]
                    })
                },

            }
        )
    }




}