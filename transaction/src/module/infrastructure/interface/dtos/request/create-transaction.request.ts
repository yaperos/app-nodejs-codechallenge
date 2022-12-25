import { Exclude, Expose, Transform } from 'class-transformer'
import { IsEnum, IsNumber, IsPositive, IsString, IsUUID, Matches } from 'class-validator'
import { BaseDto } from '../../../../../core/dtos/base.dto'

export enum TransferTypeEnum {
  WEB = 1,
  AGENCY = 2,
  ATM = 3,
}

@Exclude()
export class CreateTransactionRequest extends BaseDto {
  @Expose()
  @IsString()
  @IsUUID()
  readonly accountExternalIdCredit: string

  @Expose()
  @IsString()
  @IsUUID()
  readonly accountExternalIdDebit: string

  @Matches(/^[123]$/)
  readonly transferType: number

  @Expose()
  @IsPositive()
  readonly value: number
}
