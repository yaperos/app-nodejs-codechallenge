import { IEventService } from "../domain/event.service";
import EventEntity, { EventMessages } from "../domain/event.entity";

export default class EventUseCase {
    constructor(private readonly eventService: IEventService){
        
    }

    checkLimit = async(transaction: EventEntity) => {
        if(transaction.value > 1000) {
            this.eventService.checkLimit(EventMessages.TRANSACTION_REJECTED, transaction)
        } else {
            this.eventService.checkLimit(EventMessages.TRANSACTION_APPROVED, transaction)
        }
    }
}