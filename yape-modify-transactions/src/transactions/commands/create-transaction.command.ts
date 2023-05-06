import { IsUUID } from 'class-validator';

export class CreateTransactionCommand {

    @IsUUID()
    accountExternalIdDebit: string;

    @IsUUID()
    accountExternalIdCredit: string;
    
    transferTypeId: number;

    value: number;
}