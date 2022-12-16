import { Controller, Get, Param } from '@nestjs/common';
import { Observable } from 'rxjs';
import { TransactionEntity } from 'src/domain/models/transaction.entity';
import { TransactionQueryUsecase } from 'src/domain/usecases/transaction_query_usecase';
import { FromTransactionCreationRequestDtoConverter } from './converter/from_transaction_creation_request_dto.converter';
@Controller('transaction')
export class TransactionRestController {
  constructor(
    private readonly transactionQueryUsecase: TransactionQueryUsecase,
    private readonly fromDtoConverter: FromTransactionCreationRequestDtoConverter,
  ) {}

  @Get(':transactionId')
  findOne(
    @Param('transactionId') transactionId: string,
  ): Observable<TransactionEntity> {
    return this.transactionQueryUsecase.findById(transactionId);
  }
}
