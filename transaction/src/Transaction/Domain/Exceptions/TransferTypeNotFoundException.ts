import { ERROR_GENERAL } from "../Constants/CommonConstants";
import { BaseException } from "./BaseException";

export class TransferTypeNotFoundException extends BaseException {
    constructor(transferTypeId: string) {
        super();
        this.status = ERROR_GENERAL.ERROR_404.CODE;
        this.message = ERROR_GENERAL.ERROR_404.TITLE;

        this.response = {
            field: 'transferTypeId',
            message: `TransferType with ID ${transferTypeId} not found`,
        }

        this.name = 'TransferTypeNotFoundException';

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, TransferTypeNotFoundException);
        }
    }
}
