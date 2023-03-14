import { IsNumber } from 'class-validator';

export class TransactionValidateDto {
  constructor(
    id: number,
    value: number
  ) {
    this.id = id;
    this.value = value;
  }

  @IsNumber()
  readonly id: number;

  @IsNumber()
  readonly value: number;
}
