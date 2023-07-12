import { IsNotEmpty, IsNumber, IsPositive, IsString, Validate } from 'class-validator';
import { IsGuidConstraint } from '../validators/is_guid';

export class CreateTransactionDto {
  @IsString()
  @IsNotEmpty()
  @Validate(IsGuidConstraint)
  public readonly accountExternalIdDebit: string;

  @IsString()
  @IsNotEmpty()
  @Validate(IsGuidConstraint)
  public readonly accountExternalIdCredit: string;

  @IsNumber()
  @IsNotEmpty()
  readonly tranferTypeId: number;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  readonly value: number;
}