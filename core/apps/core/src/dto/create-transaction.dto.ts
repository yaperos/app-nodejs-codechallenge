import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class CreateTransctionDto {
    @ApiProperty()
    @IsString()
    public accountExternalIdDebit: string;

    @ApiProperty()
    @IsString()
    public accountExternalIdCredit: string;

    @ApiProperty()
    @IsNumber()
    public tranferTypeId: number;

    @ApiProperty()
    @IsNumber()
    public value: number;
}
