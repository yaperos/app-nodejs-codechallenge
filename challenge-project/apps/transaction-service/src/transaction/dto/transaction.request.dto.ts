import { IsDecimal, IsNumber, IsString, IsUUID, Max, MaxLength, Min } from "class-validator"

export class TransactionRequestDto {
    @IsUUID()
    accountExternalIdDebit: string

    @IsUUID()
    accountExternalIdCredit: string

    @IsNumber()
    @Min(1)
    @Max(100)
    transferTypeId: number

    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    @Max(9999)
    value: number
}