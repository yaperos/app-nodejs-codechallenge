import { IsNotEmpty, IsNumber, IsUUID } from "class-validator";

export class AntiFraudeDTO {

    @IsNotEmpty()
    @IsUUID()
    transactionExternalId: string;

    @IsNumber()
    @IsNotEmpty()
    value: number;
}