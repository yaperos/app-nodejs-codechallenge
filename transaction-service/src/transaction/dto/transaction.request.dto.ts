import { IsNumber, IsString, MaxLength } from "class-validator"

export class TransactionRequestDto {
    @IsString()
    @MaxLength(255)
    accountExternalIdDebit: string

    @IsString()
    @MaxLength(255)
    accountExternalIdCredit: string

    @IsNumber()
    transferTypeId: number

    @IsNumber()
    value: number
}