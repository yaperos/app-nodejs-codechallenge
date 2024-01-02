import axios from 'axios';
import { v4 as uuidV4 } from 'uuid';
describe('POST /api/v1/transfer', () => {
  it('should process transaction', async () => {
    const res = await axios.post(`/api/v1/transfer`, {
      accountExternalIdDebit: uuidV4(),
      accountExternalIdCredit: uuidV4(),
      tranferTypeId: 1,
      value: 100
    });

    expect(res.status).toBe(201);
    console.log(res.data);
    expect(res.data).toEqual({ message: 'Hello API' });
  });
});
