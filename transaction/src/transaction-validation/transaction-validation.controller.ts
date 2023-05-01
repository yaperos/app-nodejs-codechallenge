import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TransactionValidationService } from './transaction-validation.service';
import { CreateTransactionValidationDto } from './dto/create-transaction-validation.dto';
import { UpdateTransactionValidationDto } from './dto/update-transaction-validation.dto';

@Controller()
export class TransactionValidationController {
  constructor(
    private readonly transactionValidationService: TransactionValidationService,
  ) {}

  @MessagePattern('transactionValidation')
  create(
    @Payload() createTransactionValidationDto: CreateTransactionValidationDto,
  ) {
    return this.transactionValidationService.create(
      createTransactionValidationDto,
    );
  }
}
