import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import { TransactionServiceInterface } from '../../domain/interfaces/transaction.service.interface';
import { TransactionMapper } from '../../application/mapper/transaction.mapper';
import { AuthGuard } from 'src/shared/infrastructure/middleware/auth.middleware';
import { BaseController } from 'src/shared/infrastructure/controllers/base.controller';
import { CreateTransactionDto } from 'src/transaction/application/dto/transaction.create.dto';

@Controller('transactions')
export class TransactionController extends BaseController {
  private mapper: TransactionMapper;
  constructor(
    @Inject('TransactionService')
    private readonly service: TransactionServiceInterface,
  ) {
    super();
    this.mapper = new TransactionMapper();
  }

  @UseGuards(AuthGuard)
  @Post('')
  async create(@Body() transaction: CreateTransactionDto) {
    await this.service.create(this.mapper.toDomainCreate(transaction));
    return { success: true, message: 'La transacción se está procesando' };
  }
}
