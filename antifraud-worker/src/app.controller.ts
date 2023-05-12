import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateTransactionEventDto } from './application/adapters/create-transaction.event.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('create-transaction')
  async transactionValidation(data: CreateTransactionEventDto): Promise<string> {
    var res =  this.appService.transactionValidation(data);
    return JSON.stringify(res);
  }
}
