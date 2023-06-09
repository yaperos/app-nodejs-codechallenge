import { Controller, Get, Param, ValidationPipe } from '@nestjs/common';
import { Endpoint } from '../../../shared/infrastructure/endpoint.enum';
import { GetOneFinancialTransactionService } from '../application/get-one-financial-transaction.service';
import { GetOneFinancialTransactionRequestDTO } from './dto/get-one-financial-transaction-request.dto';
import { GetOneFinancialTransactionResponseDTO } from './dto/get-one-financial-transaction-response.dto';

@Controller(Endpoint.FinancialTransactions)
export class GetOneFinancialTransactionController {
  constructor(
    private readonly getOneFinancialTransactionService: GetOneFinancialTransactionService,
  ) {}

  @Get(':transactionExternalId')
  async handle(
    @Param(new ValidationPipe())
    params: GetOneFinancialTransactionRequestDTO,
  ): Promise<GetOneFinancialTransactionResponseDTO> {
    const financialTransaction =
      await this.getOneFinancialTransactionService.handle(
        params.transactionExternalId,
      );

    const response: GetOneFinancialTransactionResponseDTO = {
      transactionExternalId: financialTransaction.id.value,
      transactionType: {
        name: financialTransaction.type.value,
      },
      transactionStatus: {
        name: financialTransaction.status.value,
      },
      value: financialTransaction.value.value,
      createdAt: financialTransaction.createdAt.value,
    };

    return response;
  }
}
