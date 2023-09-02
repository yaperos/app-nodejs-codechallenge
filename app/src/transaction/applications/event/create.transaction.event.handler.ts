import { Inject } from "@nestjs/common";
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { KafkaService } from "libs/KafkaModule";
import { Transactional } from "libs/Transactional";
import { Config } from "src/Config";
//import { ProducerService } from "src/producer.service";
import { CreatedTransactionEvent } from "src/transaction/domains/event/created.transaction.event";

@EventsHandler(CreatedTransactionEvent)
export class CreateTransactionEventHandler implements IEventHandler<CreatedTransactionEvent>
{    
    constructor(){
        
    }
    
    async handle(event: CreatedTransactionEvent) {  
        const kafkaService = new KafkaService(Config.BROKER); 
        console.log("evento Dominio Disparado " + event.value.toString())        
        kafkaService.produce('created.transaction',{value:JSON.stringify(event)}); 
        console.log("fin");
    }

}