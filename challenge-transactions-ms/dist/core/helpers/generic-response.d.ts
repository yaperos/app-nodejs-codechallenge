import { TransactionVerify } from 'src/module/domain/aggregates/transaction-verify';
export declare class TransactionGenericApiResponse {
    data: TransactionVerify | null | [];
    message: string;
    statusCode?: number;
    constructor(data?: TransactionVerify | null | [], message?: string, statusCode?: number);
}
