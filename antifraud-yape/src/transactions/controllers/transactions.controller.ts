import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TransactionsService } from '../services/transactions.service';
import { UpdateTransactionDto } from '../dto/update-transaction.dto';

@Controller()
export class TransactionsController {

  constructor(private readonly transactionsService: TransactionsService) {}

  @MessagePattern('antifraud')
  updateStatusTransaction(@Payload() updateTransactionDto: UpdateTransactionDto) {
    Logger.debug(updateTransactionDto,'TransactionsController - TransactionUpdated');
    this.transactionsService.updateStatusTransaction(updateTransactionDto.id);
  }

}
