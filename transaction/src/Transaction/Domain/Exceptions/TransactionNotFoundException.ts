import { ERROR_GENERAL } from "../Constants/CommonConstants";
import { BaseException } from "./BaseException";

export class TransactionNotFoundException extends BaseException {

    constructor(transactionExternalId: string) {
        super();
        this.status = ERROR_GENERAL.ERROR_404.CODE;
        this.message = ERROR_GENERAL.ERROR_404.TITLE;

        this.response = {
            field: 'transactionExternalId',
            message: `Transaction with ID ${transactionExternalId} not found`,
        }

        this.name = 'TransactionNotFoundException';

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, TransactionNotFoundException);
        }
    }
}
