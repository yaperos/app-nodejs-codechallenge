import { IsDecimal, IsNumber, IsString, IsUUID, MaxLength, Min } from "class-validator"

export class TransactionRequestDto {
    @IsUUID()
    accountExternalIdDebit: string

    @IsUUID()
    accountExternalIdCredit: string

    @IsNumber()
    @Min(1)
    transferTypeId: number

    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    value: number
}