import { IEventService } from "../../../domain/event.service";
import { EventMessages } from "../../../domain/event.entity";
import eventEntity from "../../../domain/event.entity";

export class EventServiceMock implements IEventService {
    async checkLimit(topic: string, transaction: eventEntity): Promise<any> {
        console.log(topic)
        console.log(transaction)

        if (EventMessages.isEventMessage(topic)) {
            return Error("Not valid message")
        }

        return null
    }
}