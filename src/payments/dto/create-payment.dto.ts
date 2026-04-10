import { IsNotEmpty, IsNumber, IsPositive, IsString, Length } from 'class-validator';

export class CreatePaymentDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @Length(2, 8)
  country: string;

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsString()
  @Length(3, 8)
  currency: string;
}
