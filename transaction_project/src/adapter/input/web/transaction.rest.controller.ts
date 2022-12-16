import { Body, Controller, Post } from '@nestjs/common';
import { TransactionCreationUsecase } from 'src/domain/usecases/transaction_creation.usecase';
import { ToTransactionDomainConverter } from './converter/to_transaction_domain.converter';
import { TransactionCreationRequestDto } from './dto/transaction_creation.request.dto';

@Controller('transaction')
export class TransactionRestController {
  constructor(
    private readonly transactionCreationUsecase: TransactionCreationUsecase,
    private readonly toTransactionDomainConverter: ToTransactionDomainConverter,
  ) {}

  @Post()
  async create(@Body() transactionDto: TransactionCreationRequestDto) {
    console.log(
      '>> TX TransactionRestController: Incoming REST request: ' +
        JSON.stringify(transactionDto),
    );

    return this.transactionCreationUsecase.create(
      this.toTransactionDomainConverter.convert(transactionDto),
    );
  }
}
