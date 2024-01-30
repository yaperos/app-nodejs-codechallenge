import {
  IsIn,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class EmitTransactionUpdateDto {
  @IsString()
  @IsNotEmpty()
  transactionId: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['APPROVED', 'REJECTED'])
  status: 'APPROVED' | 'REJECTED';
}
