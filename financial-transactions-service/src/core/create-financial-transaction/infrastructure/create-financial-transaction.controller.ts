import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { Endpoint } from '../../../shared/infrastructure/endpoint.enum';
import { CreateFinancialTransactionService } from '../application/create-financial-transaction.service';
import { CreateFinancialTransactionRequestDTO } from './dto/create-financial-transaction-request.dto';
import { CreateFinancialTransactionResponseDTO } from './dto/create-financial-transaction-response.dto';

@Controller(Endpoint.FinancialTransactions)
export class CreateFinancialTransactionController {
  constructor(
    private readonly createFinancialTransactionService: CreateFinancialTransactionService,
  ) {}

  @Post()
  async handle(
    @Body(new ValidationPipe())
    createFinancialTransactionRequestDTO: CreateFinancialTransactionRequestDTO,
  ): Promise<CreateFinancialTransactionResponseDTO> {
    const financialTransaction =
      await this.createFinancialTransactionService.handle(
        createFinancialTransactionRequestDTO,
      );

    const createFinancialTransactionResponseDTO =
      new CreateFinancialTransactionResponseDTO(financialTransaction.id.value);

    return createFinancialTransactionResponseDTO;
  }
}
