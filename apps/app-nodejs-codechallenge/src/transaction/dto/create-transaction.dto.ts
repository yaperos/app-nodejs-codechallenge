import { IsOptional, IsUUID, IsPositive, IsNumber } from "class-validator";
import { BadRequestException } from "@nestjs/common";

export default class CreateTransactionDto {
  @IsOptional()
  @IsUUID()
  accountExternalIdDebit?: string;

  @IsOptional()
  @IsUUID()
  accountExternalIdCredit?: string;

  @IsNumber()
  @IsPositive()
  value: number;

  constructor(accountExternalIdDebit: string, accountExternalIdCredit: string) {
    this.validate(accountExternalIdDebit, accountExternalIdCredit);
    this.accountExternalIdDebit = accountExternalIdDebit;
    this.accountExternalIdCredit = accountExternalIdCredit;
  }

  private validate = (
    accountExternalIdDebit: string,
    accountExternalIdCredit: string,
  ) => {
    if (
      (!accountExternalIdDebit && !accountExternalIdCredit) ||
      (accountExternalIdDebit && accountExternalIdCredit)
    )
      throw new BadRequestException(
        "Exactly one of accountExternalIdDebit or accountExternalIdCredit must be provided, not both.",
      );
  };
}
