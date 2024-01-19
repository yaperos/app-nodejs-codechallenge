import Producer from "./services/producer";

export enum ETypeEventTransaction {
    EVENT_NEW_TRANSACTION = "EVENT_NEW_TRANSACTION",
}

export enum EStatus {
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    PENDING = "PENDING"
}

export interface IPayloadBody {
    value: number,
    id: string
}

export interface typeSearchTransaction {
    transactionId: string;
}

export interface contextTransaction {
    producer: Producer;
}

export interface ArgsTransaction {
    input: {
        accountExternalIdDebit: string;
        accountExternalIdCredit: string;
        tranferTypeId: number;
        value: number;
    };
  }
  
