import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateTransactionDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;
}
