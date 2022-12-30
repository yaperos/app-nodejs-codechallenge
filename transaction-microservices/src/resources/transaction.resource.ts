import { Transfer } from '../models';
import { TransactionInterface } from '../../src/Interfaces/transaction.interface'

export const TransactionResource = async (data: TransactionInterface) => {
  const transfer = await Transfer.query().findById(data.tranferTypeId);
  
  return {
    "transactionExternalId": data.transactionExternalId,
    "transactionType": {
      "name": transfer?.name
    },
    "transactionStatus": {
      "name": data.status
    },
    "value": data.value,
    "createdAt": data.createdAt
  }
}
