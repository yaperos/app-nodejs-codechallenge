import { Controller, ValidationPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Topics } from '../../../shared/infrastructure/topics';
import { ValidateFinancialTransactionService } from '../application/validate-financial-transaction.service';
import { ValidateFinancialTransactionRequestDTO } from './dto/validate-financial-transaction-status-request.dto';

@Controller()
export class ValidateFinancialTransactionController {
  constructor(
    private readonly validateFinancialTransactionService: ValidateFinancialTransactionService,
  ) {}

  @MessagePattern([Topics.FinancialTransactionCreatedTopic])
  async handle(
    @Payload(new ValidationPipe())
    validateFinancialTransactionRequestDTO: ValidateFinancialTransactionRequestDTO,
  ): Promise<void> {
    await this.validateFinancialTransactionService.handle(
      validateFinancialTransactionRequestDTO,
    );
  }
}
