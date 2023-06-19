import { TransactionStatus } from "../enum";

export class TransactionCreatedEventResponse {

    transactionExternalId: string;
    status: TransactionStatus;

}