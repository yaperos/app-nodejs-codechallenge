import { IsNumber, IsPositive, IsUUID } from "class-validator";

export default class TransactionInDto {
  @IsUUID()
  id: string;

  @IsNumber()
  @IsPositive()
  value: number;
}
