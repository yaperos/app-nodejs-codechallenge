import axios from 'axios';
import { randomBytes } from 'crypto';

const generateGUID = (): string => [4, 2, 2, 2, 6]
  .map(groupLength => randomBytes(groupLength).toString('hex')).join('-');
const URL = 'http://localhost:3002/transaction';

for (let index = 0; index < 1; index++) {
  const payload = {
    accountExternalIdDebit: generateGUID(),
    accountExternalIdCredit: generateGUID(),
    transferTypeId: 1,
    value: (Math.floor(Math.random() * 15) + 1)*100,
  };
  
  axios.post(URL, payload)
    .catch(error => {
      console.error('Error:', error, payload);
    });
}

