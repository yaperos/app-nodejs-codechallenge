import { Controller } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import {
  CREATE_TRANSACTION,
  GET_ONE_TRANSACTION,
} from '@app/common/constants/transaction-events';
import { VERIFIED_TRANSACTION } from '@app/common/constants/anti-fraud-events';

@Controller()
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @MessagePattern(CREATE_TRANSACTION)
  async createTransaction(@Payload() data) {
    return this.transactionsService.create(data);
  }

  @MessagePattern(GET_ONE_TRANSACTION)
  async getTransaction(@Payload() data) {
    return this.transactionsService.getOne(data);
  }

  @EventPattern(VERIFIED_TRANSACTION)
  async updateTransactionStatus(@Payload() data) {
    return this.transactionsService.updateStatus(data);
  }
}
