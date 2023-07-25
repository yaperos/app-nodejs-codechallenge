import { PartialType } from '@nestjs/mapped-types';
import { CreateTransactionDto } from './create-transaction.dto';

export class UpdateTransactionDto extends PartialType(CreateTransactionDto) {
    created_at?: Date;
    account_external_id_debit?: string;
    account_external_id_credit?: string;
    transfer_type_id?: number;
    value?: number;
    transaction_external_id?: string;
    transaction_status_name?: string;
    transaction_type_name?: string;
}
