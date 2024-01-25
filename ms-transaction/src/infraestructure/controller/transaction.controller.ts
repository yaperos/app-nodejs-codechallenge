import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { TransactionUseCase } from "src/application/transaction";
import { TransactionRequest } from "src/helper/type.helper";
import { ProducerService } from "../message/kafka/producer.service";
import { ConsumerService } from "../message/kafka/consumer.service";

@Controller('transaction')
export class TransactionController{

    constructor(private readonly transactionUseCase: TransactionUseCase,
                private readonly producerService: ProducerService,
                private readonly consumerService:ConsumerService
        ) {

    }

    @Post()
    async registerTransaction(@Body() data:TransactionRequest){
        
        const result = await this.transactionUseCase.registerTrx(data);
        const jsonString = JSON.stringify(result);
        await this.producerService.produce('transactionTopic', {
            value: jsonString,
          });
        

        await this.consumerService.consume( 
            { topic: { topics: ['transactionTopic']}, 
            config: { groupId: 'transaction-consumer' }, 
            onMessage: async (message) => {
                /*console.log( 'message=>',message,typeof(message.value));*/
                    console.log(message);
                    /* throw new Error('Test error!'); */
                }
            });


        return result;
    }

    @Get(':id')
    async getTransaction(@Param('id')id :number){
       const result =await this.transactionUseCase.findTrx(id);
       return result;
    }

}