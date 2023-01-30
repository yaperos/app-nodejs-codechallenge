import { Transaction, Transfer } from '../models';

export const TransactionResource = async (data: Transaction) => {
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
