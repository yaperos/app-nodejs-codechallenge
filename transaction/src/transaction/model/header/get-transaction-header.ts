import { IsNotEmpty, IsNumber, IsPositive, IsString, IsUUID } from 'class-validator';

export class GetTransactionHeader {

  @IsString()
  producttype: string;

  @IsString()
  productid: string;
}
