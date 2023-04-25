import { Type } from "class-transformer";
import { IsNumber, Max, Min } from "class-validator";

export class TransactionQueryDto {
    @IsNumber()
    @Type(() => Number)
    @Max(500)
    @Min(0)
    limit: number = 100;

    @IsNumber()
    @Type(() => Number)
    @Max(500)
    @Min(0)
    offset: number = 0
}