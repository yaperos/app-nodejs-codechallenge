import { Type } from "class-transformer";
import { IsNumber, Max } from "class-validator";

export class TransactionQueryDto {
    @IsNumber()
    @Type(() => Number)
    @Max(500)
    limit: number;

    @IsNumber()
    @Type(() => Number)
    @Max(500)
    offset: number
}