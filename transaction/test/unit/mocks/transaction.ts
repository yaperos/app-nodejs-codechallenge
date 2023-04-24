import {HeadersDto} from "@/contexts/transaction/dto/headers.dto";
import {TYPES} from "@/config/constants/types";


export const transaction = {
    accountExternalIdDebit: "Oscar",
    accountExternalIdCredit: "Oscar",
    transferTypeId: 1,
    value: 1200.00
}

export const headers: HeadersDto = {commerce: 'CMR', channel: 'WEB', entityId: 'Guid'};

export const uuidMock = '0a949122-5145-11ed-bdc3-0242ac120002';

export const insertedDataMock = {
    transaction_id: 'a',
    account_external_id_debit: 'a',
    account_external_id_credit: 'a',
    transaction_type: 'a',
    transaction_status: 'a',
    value: 1000,
}
