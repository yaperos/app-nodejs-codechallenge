import { IsUUID } from "class-validator";

export class TransactionFindoneDto {
    @IsUUID()
    id: string
}