import { Field, InputType } from "@nestjs/graphql";
import { IsNumber, IsString, IsUUID, Max, Min } from "class-validator";

@InputType()
export class CreateTransactionInput {
  @IsString()
  @IsUUID()
  @Field({
    nullable: false,
  })
  accountExternalIdDebit: string;

  @IsString()
  @IsUUID()
  @Field({
    nullable: false,
  })
  accountExternalIdCredit: string;

  @IsNumber({
    allowNaN: false,
  })
  @Min(1)
  @Max(2)
  @Field({
    nullable: false,
  })
  transferTypeId: number;

  @IsNumber()
  @Min(1)
  @Field({
    nullable: false,
  })
  value: number;
}
