import { IsNumber, IsPositive, IsString } from 'class-validator';

export class TransactionValidDto {
  @IsString()
  id: string;

  @IsNumber()
  @IsPositive()
  value: number;
}
