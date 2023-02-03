import { Controller, Get } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { ValidateService } from './validate.service';

@Controller()
export class AppController {
  constructor(private readonly validateService: ValidateService) {}

  @EventPattern('transaction')
  validateTransaction(message: string) {
    console.log(`Received event: ${message}`);
    console.log(message);
  }

}
