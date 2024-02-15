import { IsNotEmpty } from 'class-validator';

export class transactionRequest {
    @IsNotEmpty()
    transactionExternalId: string;

}