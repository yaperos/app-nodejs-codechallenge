import { IsNumber, IsString, IsUUID, MaxLength } from "class-validator"

export class TransactionRequestDto {
    @IsUUID()
    accountExternalIdDebit: string

    @IsUUID()
    accountExternalIdCredit: string

    @IsNumber()
    transferTypeId: number

    @IsNumber()
    value: number
}