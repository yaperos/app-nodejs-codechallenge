import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TransactionDto } from './dto/transaction.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('transaction-producer')
  validateTransaction(@Payload() message: TransactionDto): void {
    this.appService.validateTransaction(message);
  }
}
