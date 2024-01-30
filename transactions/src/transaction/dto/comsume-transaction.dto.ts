import {
  IsIn,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class ConsumeTransactionDto {
  @IsString()
  @IsNotEmpty()
  transactionId: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['APPROVED', 'REJECTED'])
  status: 'APPROVED' | 'REJECTED';
}
