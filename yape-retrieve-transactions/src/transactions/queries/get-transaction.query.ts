import { Expose } from 'class-transformer';
import { IsUUID } from 'class-validator';

export class GetTransactionQuery {
    @IsUUID()
    @Expose({ name: 'id' })
    transactionExternalId: string;
}