import { v5 as uuidv5 } from 'uuid';

export function validationResponse(accountExternalIdDebit, accountExternalIdCredit, tranferTypeId, value) {

    //TransferTypeId
    //1 - debit
    //2 - credit
    const limit = 1000;
    const status = value >= limit ? 'rejected' : 'approved';
    const date = new Date();

    const dataToHash = JSON.stringify({ accountExternalIdDebit, accountExternalIdCredit, tranferTypeId, status, date });

    const uuid = uuidv5(dataToHash, uuidv5.DNS);
    const transferType = tranferTypeId === 1 ? "debit" : tranferTypeId === 2 ? "credit" : "unknown";


    return { status, date, uuid, transferType };
}
