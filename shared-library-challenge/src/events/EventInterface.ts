import { type EventsEnum } from './EventsEnum'

export interface EventInterface {
  attributes: {
    topic: EventsEnum
    timestamp: Date
  }
  data: Record<string, any>
}
