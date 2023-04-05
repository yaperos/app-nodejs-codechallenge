import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import { ITransaction } from './interface/transaction.interface';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('validate_transaction')
  handleValidateTransaction(@Payload() message: ITransaction): number {
    return this.appService.validateTransaction(message);
  }
}
