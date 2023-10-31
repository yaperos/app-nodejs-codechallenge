import { type EventMessageContent } from './eventMessageContent.interface'

export interface EventMessage<T> {
  key: string
  value: EventMessageContent<T>
}
