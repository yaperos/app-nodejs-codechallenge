import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsEnum, IsNotEmpty, IsNumber, IsString, IsUUID } from "class-validator"
import { ETransferType } from "../../../domain/transaction"

export class TransactionCreateDto {
    @ApiProperty({
        description: "Id account external debit",
        example: "d28beff0-c093-48a7-b88c-59458ec74d1c"
    })
    @IsNotEmpty()
    @IsString()
    @IsUUID()
    accountExternalIdDebit: string

    @ApiProperty({
        description: "Id account external credit",
        example: "d28beff0-c093-48a7-b88c-59458ec74d1c"
    })
    @IsNotEmpty()
    @IsString()
    @IsUUID()
    accountExternalIdCredit: string

    @ApiProperty({
        description: "Type of transference",
        example: 2
    })
    @IsNotEmpty()
    @IsEnum(ETransferType)
    transferTypeId: number

    @ApiProperty({
        description: "Value in transaction",
        example: 300
    })
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    value: number
}