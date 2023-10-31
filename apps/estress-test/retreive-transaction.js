import http from 'k6/http';

export let options = {
  vus: 1000,
  duration: '30s',
};

export default function () {
  const url = 'http://localhost:3001/graphql';

  const query = `
    query RetrieveTransaction($externalId: String!) {
      retrieveTransaction(externalId: $externalId) {
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
    }
  `;

  const variables = {
    externalId: '5e1097e3599348568d61c4ca532e3413',
  };

  const headers = {
    'Content-Type': 'application/json',
  };

  http.post(url, JSON.stringify({ query, variables }), { headers });
}
