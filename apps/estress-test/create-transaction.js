import { check } from 'k6';
import http from 'k6/http';

export const options = {
  vus: 1000,
  duration: '60s',
};

function getRandomValue() {
  return Math.random() < 0.8 ? Math.floor(Math.random() * 1000) : 1000 + Math.floor(Math.random() * 1000);
}

function getRandomTransferTypeId() {
  return Math.floor(Math.random() * 4) + 1;
}

function generateRandomUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    let r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export default function () {
  const url = 'http://localhost:3001/graphql';
  const externalAccountId = generateRandomUUID();
  const payload = JSON.stringify({
    query: `
      mutation Mutation($input: CreateTransactionUseCaseInput!) {
        createTransaction(input: $input) {
          transactionExternalId
          transactionStatus {
            name
          }
          transactionType {
            name
          }
          value
          createdAt
        }
      }`,
    variables: {
      input: {
        accountExternalIdCredit: externalAccountId,
        accountExternalIdDebit: externalAccountId,
        tranferTypeId:  getRandomTransferTypeId(),
        value: getRandomValue(),
      },
    },
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const response = http.post(url, payload, params);
}