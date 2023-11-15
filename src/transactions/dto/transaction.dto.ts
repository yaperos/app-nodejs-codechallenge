import {
  IsUUID,
  /* IsNotEmpty, */ IsNumber,
  Min,
  Max,
  IsOptional,
} from 'class-validator';

export class CreateTransactionDto {
  @IsUUID()
  @IsOptional()
  accountExternalIdDebit?: string;

  @IsUUID()
  @IsOptional()
  accountExternalIdCredit?: string;

  @IsNumber()
  tranferTypeId: number;

  @IsNumber()
  @Min(0)
  //@Max(1000)
  value: number;
}
