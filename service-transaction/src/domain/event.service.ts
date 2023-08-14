import EventEntity from "./event.entity"

export interface IEventService {
    addEvent(topic: string, transaction: EventEntity): Promise<any | null>
}