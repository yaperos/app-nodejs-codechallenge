import { Controller, Inject } from '@nestjs/common';
import { TransactionServiceInterface } from '../../domain/interfaces/transaction.service.interface';
import { BaseController } from 'src/shared/infrastructure/controllers/base.controller';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Transaction } from 'src/transaction/domain/entities/transaction.type';

@Controller('transactions')
export class TransactionController extends BaseController {
  constructor(
    @Inject('TransactionService')
    private readonly service: TransactionServiceInterface,
  ) {
    super();
  }

  @MessagePattern('validate_transaction')
  async created(@Payload() message: Transaction): Promise<boolean> {
    const data = await this.service.check(message);
    return data;
  }
}
