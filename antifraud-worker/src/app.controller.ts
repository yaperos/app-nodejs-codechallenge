import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('create-transaction')
  async transactionValidation(data: any) {
    console.log(data);
    return "ok-hhhhhhhhhh"
  }
}
