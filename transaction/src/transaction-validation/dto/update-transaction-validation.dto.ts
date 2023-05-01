import { PartialType } from '@nestjs/mapped-types';
import { CreateTransactionValidationDto } from './create-transaction-validation.dto';

export class UpdateTransactionValidationDto extends PartialType(CreateTransactionValidationDto) {
  id: number;
}
