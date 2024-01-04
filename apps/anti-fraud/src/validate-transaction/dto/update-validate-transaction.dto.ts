import { PartialType } from '@nestjs/mapped-types';
import { CreateValidateTransactionDto } from './create-validate-transaction.dto';

export class UpdateValidateTransactionDto extends PartialType(CreateValidateTransactionDto) {
  id: number;
}
