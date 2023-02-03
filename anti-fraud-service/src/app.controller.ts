import { Controller, Get } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { json } from 'stream/consumers';
import { ValidateService } from './validate.service';
import { EventService } from './event.service';

@Controller()
export class AppController {
  constructor(
    private readonly validateService: ValidateService,
    //private readonly eventService: EventService,
  ) {}

  @EventPattern('transaction')
  validateTransaction(message: string) {
    console.log(`Received event: ${message}`);
    console.log(message);
    //this.eventService.sendEvent(name);
  }

}
