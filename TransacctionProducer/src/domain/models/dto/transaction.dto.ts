/**
 * @author RRG
 */

import { ApiProperty } from "@nestjs/swagger"
import { IsDate, IsEnum, IsInt, IsOptional, IsString, NotEquals } from "class-validator"

export enum AppState {
    pending = 1,
    approved = 2,
    rejected = 3
}

export class TransactionDto {

    @ApiProperty({ description : "accountExternalIdDebit " , type : String })
    @IsString()
    accountExternalIdDebit : string

    @ApiProperty({ description : "accountExternalIdCredit " , type : String })
    @IsString()
    accountExternalIdCredit : string

    @ApiProperty({ description : "tranferTypeId " , type : Number })
    @IsInt()
    tranferTypeId : number

    @ApiProperty({ description : "value " , type : Number })
    @IsInt()
    value : number

    @ApiProperty({ description : "status " , type : Number })
    @IsInt()
    @IsEnum(AppState)
    @NotEquals(AppState)
    status : number

    @ApiProperty({ description : "createdat " , type : Number })
    @IsDate()
    @IsOptional()
    createdAt : string
}