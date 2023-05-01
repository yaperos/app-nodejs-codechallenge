import { Injectable } from '@nestjs/common';
import { CreateTransactionValidationDto } from './dto/create-transaction-validation.dto';

@Injectable()
export class TransactionValidationService {
  create(createTransactionValidationDto: CreateTransactionValidationDto) {
    console.log(createTransactionValidationDto);
  }
}
