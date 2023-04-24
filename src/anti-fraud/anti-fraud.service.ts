import { ConsumerService, ProducerService } from "@core/notificator";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { TransactionStatusEnum } from "commons/emun";
@Injectable()
export class AntiFraudService implements OnModuleInit {
    constructor(private readonly consumerService : ConsumerService,
                private readonly produceService: ProducerService){}
    async onModuleInit() {
        await this.consumerService.consume(
            { topics: ['anti-fraud'], fromBeginning: false},
            {
            eachMessage: async ({topic, partition, message})=>{
                const data = JSON.parse(message.value.toString())['data']
                data.valueTransaction >= 1000 ? data.transactionStatus['name'] = TransactionStatusEnum.rejected : 
                    data.transactionStatus['name'] = TransactionStatusEnum.approved;
                this.produceService.__producerUpdate([{data: data}])
            }
        });
    }

}