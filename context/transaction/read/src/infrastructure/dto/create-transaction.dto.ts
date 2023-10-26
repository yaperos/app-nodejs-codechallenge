import { Field, InputType, Int } from "@nestjs/graphql";
import { IsEnum, IsNotEmpty, IsNumber, IsUUID } from "class-validator";
import { TransactionTypeId } from "../../domain/enums/transaction-type.enum";

@InputType()
export class CreateTransactionDto {
  @IsUUID()
  @IsNotEmpty()
  @Field({ description: "External debit account ID field (uuid)" })
  accountExternalIdDebit: string;

  @IsUUID()
  @IsNotEmpty()
  @Field({ description: "External credit account ID field (uuid)" })
  accountExternalIdCredit: string;

  @IsNumber()
  @IsEnum(TransactionTypeId, {
    message: "Invalid transaction type",
  })
  @Field(() => Int, { description: "Tranfer type ID field (int)" })
  transferTypeId: number;

  @IsNumber()
  @IsNotEmpty()
  @Field(() => Int, { description: "Value field (int)" })
  value: number;
}
