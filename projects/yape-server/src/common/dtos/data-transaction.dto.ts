import { ObjectType } from '@nestjs/graphql';
import { IsNumber, IsString } from 'class-validator';

@ObjectType()
export class DataTransactionDto {
  @IsString()
  transactionId: string;

  @IsString()
  stripePaymentMethodId: string;

  @IsString()
  stripeCostumerId: string;

  @IsString()
  currency: string;

  @IsString()
  paymentMethodType: string;

  @IsNumber()
  amount: number;
}
