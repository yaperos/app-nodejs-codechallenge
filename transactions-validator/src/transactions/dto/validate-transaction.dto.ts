import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class TransactionDto {
  @IsNotEmpty()
  @IsUUID()
  readonly uuid: string;

  @IsNotEmpty()
  @IsNumber()
  readonly value: number;
}
