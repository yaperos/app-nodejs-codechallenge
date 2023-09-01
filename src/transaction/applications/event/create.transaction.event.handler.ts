import { Inject } from "@nestjs/common";
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { ProducerService } from "src/producer.service";
import { CreatedTransactionEvent } from "src/transaction/domains/event/created.transaction.event";

@EventsHandler(CreatedTransactionEvent)
export class CreateTransactionEventHandler implements IEventHandler<CreatedTransactionEvent>
{
    
    constructor(){
        
    }
    async handle(event: CreatedTransactionEvent) {   
        const producerService: ProducerService = new ProducerService('created.transaction','localhost:9092');       
        console.log("evento Dominio Disparado " + event.value.toString())        
        await  producerService.produce('created.transaction',{value:JSON.stringify(event)}); 
        console.log("fin");
    }

}