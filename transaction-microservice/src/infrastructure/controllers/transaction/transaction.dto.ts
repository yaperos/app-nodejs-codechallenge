import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateTransactionDto{
    @ApiProperty({required: true})
    @IsNotEmpty()
    @IsString()
    accountExternalIdDebit: string;
    @ApiProperty({required: true})
    @IsNotEmpty()
    @IsString()
    accountExternalIdCredit: string;
    @ApiProperty({required: true})
    @IsNotEmpty()
    @IsNumber()
    transferTypeId: number;
    @ApiProperty({required: true})
    @IsNotEmpty()
    @IsNumber()
    value: number;
}