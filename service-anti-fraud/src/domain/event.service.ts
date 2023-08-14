import EventEntity from "./event.entity"

export interface IEventService {
    checkLimit(topic: string, transaction: EventEntity): Promise<any | null>
}