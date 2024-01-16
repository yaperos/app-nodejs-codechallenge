import { TransactionStatusEnum } from 'src/enums/trasaction-status.enum';
import { v4 as uuidv4 } from 'uuid';
export class RetrieveTransaction {
    transactionExternalId: string = uuidv4();
    transactionType: {
      name: string;
    };
    transactionStatus: {
      name: TransactionStatusEnum;
    };
    value: number;
    createdAt: Date = new Date();
  
    constructor() {
      this.transactionType = { name: '' };
      this.transactionStatus = { name: TransactionStatusEnum.PENDING};
    }
  }
  