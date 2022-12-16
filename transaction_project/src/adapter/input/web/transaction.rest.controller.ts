import { Body, Controller, Post } from '@nestjs/common';
import { TransactionCreationUsecase } from 'src/domain/usecases/transaction_creation.usecase';
import { FromTransactionCreationRequestDtoConverter } from './converter/from_transaction_creation_request_dto.converter';
import { TransactionCreationRequestDto } from './dto/transaction_creation.request.dto';

@Controller('transaction')
export class TransactionRestController {
  constructor(
    private readonly transactionCreationUsecase: TransactionCreationUsecase,
    private readonly fromDtoConverter: FromTransactionCreationRequestDtoConverter,
  ) {}

  @Post()
  async create(@Body() transactionDto: TransactionCreationRequestDto) {
    console.log(
      '>> TX TransactionRestController: Incoming REST request: ' +
        JSON.stringify(transactionDto),
    );

    return this.transactionCreationUsecase.create(
      this.fromDtoConverter.toTransactionEntity(transactionDto),
    );
  }
}
