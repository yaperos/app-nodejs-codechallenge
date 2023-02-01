import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsUUID } from "class-validator";

export class CreateTransactionDto{
    @ApiProperty({required: true})
    @IsNotEmpty()
    @IsUUID()
    accountExternalIdDebit: string;
    @ApiProperty({required: true})
    @IsNotEmpty()
    @IsUUID()
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