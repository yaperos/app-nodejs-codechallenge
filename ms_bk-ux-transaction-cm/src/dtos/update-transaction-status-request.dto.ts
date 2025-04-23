import { IsNumber, IsString } from 'class-validator';

export class UpdateTransactionStatusRequestDto {
  @IsNumber()
  status: number;

  @IsString()
  id: string;
}
