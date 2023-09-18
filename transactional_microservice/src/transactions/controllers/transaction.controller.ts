import { Body, Controller, Get, Param, Post } from '@nestjs/common';
// Services
import { CreationTransactionService } from '../services/creationTransaction.service';
import { GettingTransactionService } from '../services/gettingTransaction.service';
// DTO
import { CreateTransactionDto } from '../dto/create_transaction.dto';
import { ResponseGetTransactionDto } from '../dto/response_get_transaction.dto';
import { ResquestGetTransactionDto } from '../dto/request_get_transaction.dto';
// Interfaces
import { ResponseErrorInterface } from 'src/../start/interfaces/responseError.interface';

@Controller('transactions')
export class TransactionController {
  constructor(
    private readonly creationTransactionService: CreationTransactionService,
    private readonly gettingTransactionService: GettingTransactionService,
  ) {}

  /**
   * Crear transacción
   */
  @Post()
  createTransaction(@Body() payload: CreateTransactionDto) {
    return this.creationTransactionService.runCreateTransaction(payload);
  }

  /**
   * Obtener una transacción específica mediante id
   */
  @Get(':transactionExternalId')
  async getTransaction(
    @Param() params: ResquestGetTransactionDto,
  ): Promise<ResponseGetTransactionDto | ResponseErrorInterface> {
    const transactionExternalId = params.transactionExternalId;
    console.log('transactionExternalId', transactionExternalId);
    return this.gettingTransactionService.getTransaction(transactionExternalId);
  }
}
