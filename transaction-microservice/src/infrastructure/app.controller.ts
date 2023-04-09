import { Controller } from '@nestjs/common';
import { AppService } from '../application/app.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { CreateTransactionDto } from '../domain/requests/create-transaction.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern('create_transaction')
  handleTransactionCreate(@Payload() data: CreateTransactionDto) {
    this.appService.createTransaction(data);
  }

  @MessagePattern('get_transactions')
  async handleTransactionGet() {
    return this.appService.getTransactions();
  }
}
