import {ApiProperty} from "@nestjs/swagger";
import {IsInt, IsString, Validate} from "class-validator";
import {IsTypeValidConstraint} from "../validators/IsTypeValidConstraint";

export class CreateTransactionDto {

    id?: number

    @ApiProperty()
    @IsInt()
    value: number;

    @ApiProperty()
    @IsString()
    accountExternalIdDebit: string;
    @ApiProperty()
    accountExternalIdCredit: string;
    statusId: number;
    @ApiProperty()
    @Validate(IsTypeValidConstraint)
    transferTypeId: number
}
