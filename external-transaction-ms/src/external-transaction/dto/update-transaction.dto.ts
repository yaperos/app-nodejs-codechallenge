import { PartialType } from '@nestjs/mapped-types';
import { CreateTransactionDto } from './create-transaction.dto';
import { IsString, IsUUID } from 'class-validator';

export class UpdateTransactionDto {
  @IsUUID()
  id: string;

  @IsString()
  status: string;
}
