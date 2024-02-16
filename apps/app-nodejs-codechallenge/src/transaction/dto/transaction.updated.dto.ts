import { IsUUID, IsPositive, IsInt } from "class-validator";

export default class TransactionUpdatedDto {
  @IsUUID()
  id: string;

  @IsInt()
  @IsPositive()
  status: number;
}
