import { ApiProperty } from "@nestjs/swagger";
import  {CreateTransactionRequest} from '../dto/create-transaction-request.dto'

export class TransactionEntity  implements CreateTransactionRequest   {
    
    @ApiProperty()
    accountExternalIdDebit: string;
    @ApiProperty()
    accountExternalIdCredit: string;
    @ApiProperty()
    tranferTypeId: number;
    @ApiProperty()
    value: number;
}
