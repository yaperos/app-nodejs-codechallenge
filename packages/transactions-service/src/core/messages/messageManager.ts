import { type EventMessage } from '../../shared/interfaces/eventMessage.interface'

export abstract class MessageManager {
  private readonly _topic: string
  private readonly _groupId: string

  constructor (groupId: string, topic: string) {
    this._topic = topic
    this._groupId = groupId
  }

  get topic (): string { return this._topic }

  get groupId (): string { return this._groupId }
  public abstract produce <T> (message: EventMessage<T>): Promise<void>
  public abstract consume (method: (message: any) => Promise<void>): Promise<void>
}
