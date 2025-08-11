import { Exclude, Expose } from "class-transformer";

@Exclude()
export class TransactionTypeDto {
  @Expose()
  readonly id: string;

  @Expose()
  readonly name: string;
}