import { Exclude, Expose } from 'class-transformer'
import { IsNotEmpty, IsNumber, IsString, IsUUID, Max, Min } from 'class-validator'
import { BaseDto } from '../../../../../core/dtos/base.dto'

const TRANSFER_MESSAGE = 'Transfer type must be 1 , 2 or 3'
@Exclude()
export class CreateTransactionRequest extends BaseDto {
  @Expose()
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  readonly accountExternalIdCredit: string

  @Expose()
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  readonly accountExternalIdDebit: string

  @Expose()
  @IsNumber()
  @Min(1, { message: TRANSFER_MESSAGE })
  @Max(3, { message: TRANSFER_MESSAGE })
  readonly tranferTypeId: number

  @Expose()
  @Min(1)
  @IsNumber()
  readonly value: number
}
