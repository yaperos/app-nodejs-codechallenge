import { request } from 'graphql-request';

export const sendCreateGraphql = (transaction:any) =>{
  request('http://localhost:3004/graphql', `mutation createdTransaction($input:TransactionInput!) {
    createdTransaction(input: $input) {
      id,
      status
      createdAt
    }
  }`,{
    input: {
      accountExternalIdCredit: transaction.accountExternalIdCredit,
      tranferTypeId: transaction.tranferTypeId,
      accountExternalIdDebit: transaction.accountExternalIdDebit,
      value:transaction.value,
      id:transaction.id
    }
  })
  .then(data => console.info(data))
  .catch(error => console.error(error));
}

export const sendUpdateGraphql = (status:string,id:string) =>{
  request('http://localhost:3004/graphql', `mutation updatedTransaction($input:TransactionInputUpdate!) {
    updatedTransaction(input: $input) {
          id,
          status
          updatedAt
        }
      }`,{
   input: {
    id: id,
    status:status
   }
 })
 .then(data => console.info(data))
 .catch(error => console.error(error));
}


export const sendGetGraphql = async (id:string) =>{
 return request('http://localhost:3004/graphql', `query Query($transactionId: String!) {
    transaction(id: $transactionId) {
      status
      value
      createdAt
      accountExternalIdDebit
      accountExternalIdCredit
      tranferTypeId
    }
      }`,{
        transactionId:id
 })
 .then((data:any) => {
  if(data.transaction){
    const { tranferTypeId, accountExternalIdDebit, accountExternalIdCredit, status, value, createdAt } = data.transaction
  return {
      transactionExternalId: tranferTypeId === '1' ? accountExternalIdDebit : accountExternalIdCredit,
      transactionType: {
        name: tranferTypeId === '1' ? "DEBITO" : "CREDITO"
      },
      transactionStatus: {
        name: status
      },
      value: value,
      createdAt: createdAt
    }
  } else {
    return data;
  }


 })
 .catch(error => console.error(error));
}