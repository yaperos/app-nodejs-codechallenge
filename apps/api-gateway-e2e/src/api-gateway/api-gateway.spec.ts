import { CommonResponse } from '@yape-transactions/shared';
import axios, { AxiosError } from 'axios';
import { UUID } from 'crypto';
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
    const responseBody = res.data as CommonResponse<{ transactionId: UUID }>;
    console.log(res.data);
    expect(responseBody.message).toEqual("Transaccion creada correctamente");
    expect(responseBody.data.transactionId).toBeDefined();
  });

  // se podrian crear mas pruebas pero por efecto de tiempo se deja como muestra
  // del ejercicio
  it('should return bad request when body is wrong', async () => {
    try {
      await axios.post(`/api/v1/transfer`, {
        accountExternalIdDebit: uuidV4(),
        accountExternalIdCredit: uuidV4(),
        tranferTypeId: 1,
        // value: 100
      });
    } catch (error) {
      const axiosError = error as AxiosError;
      //console.log(error);
      expect(axiosError.response.status).toBe(400);
    }
  });

});