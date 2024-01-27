export interface TransactionData {
    id: string;
    newStatus: Status;
}
  
export enum Status {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECT = 'REJECT',
  }


export enum topics{
    TOPIC_CONSUMER='transactionTopic',
    TOPIC_PRODUCER='transactionValidateTopic'
}

export const AMOUNT_MAX=1000;