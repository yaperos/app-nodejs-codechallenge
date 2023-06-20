import { IEventService } from "../domain/event.service";
import EventEntity, { EventMessages } from "../domain/event.entity";

export default class EventUseCase {
    constructor(private readonly eventService: IEventService){
        
    }

    updateTransaction = async(transaction: EventEntity) => {
        if(transaction.value > 1000) {
            this.eventService.addEvent(EventMessages.TRANSACTION_REJECTED, transaction)
        } else {
            this.eventService.addEvent(EventMessages.TRANSACTION_APPROVED, transaction)
        }
    }
}