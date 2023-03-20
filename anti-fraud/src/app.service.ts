import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { ApprovedEvent } from './events/approved.event';
import { CreatedEvent } from './events/create.event';
import { RejectedEvent } from './events/rejected.event';

@Injectable()
export class AppService {

  constructor( @Inject('KAFKA') private clientEmit: ClientKafka ){}

  async calculateTransaction( payload: CreatedEvent ): Promise<void> {
    const calculateEvent = payload.value > 1000 ? RejectedEvent : ApprovedEvent
    this.clientEmit.emit( calculateEvent.getName(), calculateEvent.toEvent( payload ) )
  }

}
