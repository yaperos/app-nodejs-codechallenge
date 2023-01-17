import http from 'k6/http';
import { sleep } from 'k6';
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';

export const options = {
  vus: 10,
  duration: '30s',
};

export default function () {

  const url = 'http://127.0.0.1:3000/transactions';
  const payload = JSON.stringify({
    "accountExternalIdDebit": uuidv4(),
    "accountExternalIdCredit": uuidv4(),
    "tranferTypeId": 6,
    "value": 1
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  http.post(url, payload, params);
  http.get(url);

  sleep(1);
}