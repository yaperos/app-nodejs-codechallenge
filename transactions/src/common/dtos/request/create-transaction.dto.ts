import { UUID } from "crypto";
import { IsNotEmpty, IsNumber, Min , IsUUID} from "class-validator";

export class CreateTransactionRequestDto{

    @IsNotEmpty()
    @IsUUID()
    accountExternalIdDebit: UUID;

    @IsNotEmpty()
    @IsUUID()
    accountExternalIdCredit: UUID;

    @IsNotEmpty()
    @IsNumber()
    tranferTypeId: number;

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    value: number


}