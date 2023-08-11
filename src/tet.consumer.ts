import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConsumerService } from './kafka/consumer.service';
import { TransactionsService } from './transactions/services/transactions.service';

@Injectable()
export class TestConsumer implements OnModuleInit {
    constructor(
        private readonly consumerService:ConsumerService,
        private readonly transactionService: TransactionsService
    ){}

    async onModuleInit() {
        await this.consumerService.consume(
            {topic :'test'},
            {
                eachMessage: async ({topic,partition,message}) => {
                    let transactionStatus;

                    if(parseInt(message.value.toString()) > 1000) {
                        transactionStatus='rechazado'
                    }else {
                        transactionStatus='aprobado'
                    }

                    const getTransactionById = await this.transactionService.findByIdTransaction(message.key.toString())

                    const transactionUpdate = await this.transactionService.updateTransaction(message.key.toString(),{...getTransactionById,transactionStatus})

                    console.log('se actualizo correctamente')
                    console.log(transactionUpdate)
                }
            }
        )
    }

  
}