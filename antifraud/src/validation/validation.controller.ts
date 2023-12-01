import { Controller } from '@nestjs/common';
import { ValidationService } from './validation.service';
import { FinancialTransaction } from '@transactions/transactions/entities/financial-transaction.entity';

@Controller('transactions')
export class ValidationController {
  constructor(private service: ValidationService) {}

  async validate(dto: FinancialTransaction) {
    const entity = this.service.validate(dto);
    console.log(entity);
    return entity;
  }
}
