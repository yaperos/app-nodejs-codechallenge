import { ConsoleLogger, Inject, Injectable } from '@nestjs/common';
import { EventBus, IEvent, IEventPublisher } from '@nestjs/cqrs';
import { plainToInstance } from 'class-transformer';
import { Events } from 'src/utils/constants';

@Injectable()
export class EventBusService {
  constructor(
    private eventBus: EventBus,
    @Inject('EVENT_PUBLISHER') private eventPublisher: IEventPublisher,
  ) {}

  public publish<T extends IEvent>(event: T): void {
    const data = {
      payload: event,
      eventName: event.constructor.name,
    };
    this.eventPublisher.publish(data);
  }

  async handle(message: { payload: any; eventName: string }): Promise<void> {
    const data = message.payload;
    const event = Events[message.eventName];

    if (!event) {
      console.log(`Could not find corresponding event for ${data.eventName}`);
    }

    await this.eventBus.publish(plainToInstance(event, data));
  }
}
