/**
 * @author RRG
 */

import { ApiProperty } from "@nestjs/swagger"
import { IsEnum, NotEquals } from "class-validator"

export enum AppState {
    pending = 1,
    approved = 2,
    rejected = 3
}

export class TransactionDto {

    @ApiProperty({ description: "accountExternalIdDebit ", type: String })
    accountExternalIdDebit: string

    @ApiProperty({ description: "accountExternalIdCredit ", type: String })
    accountExternalIdCredit: string

    @ApiProperty({ description: "tranferTypeId ", type: Number })
    tranferTypeId: number

    @ApiProperty({ description: "value ", type: Number })
    value: number

    @ApiProperty({ description: "status ", type: Number })
    @IsEnum(AppState)
    @NotEquals(AppState)
    status: number

    @ApiProperty({ description: "createdat ", type: Number })
    createdAt: string
}