import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TransactionDto } from '../dtos/transaction.dto';
import { AppService } from '../services/app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('transaction')
  validateTransaction(@Payload() data: TransactionDto) {
    return this.appService.validateTransaction(data);
  }
}
