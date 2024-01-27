import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { TransactionUseCase } from "src/application/transaction";
import { TransactionRequest } from "src/helper/type.helper";
import { ProducerService } from "../message/kafka/producer.service";
import { ConsumerService } from "../message/kafka/consumer.service";
import { EventPattern } from "@nestjs/microservices";

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

        return result;
    }

    @Get(':id')
    async getTransaction(@Param('id')id :number){
       const result =await this.transactionUseCase.findTrx(id);
       return result;
    }

    @EventPattern('transactionValidateTopic')
    handleMyEvent(data: any): void {
        console.log('event pattern', data.id);
    }

}