import modelTransaction from "../../src/transactions/transactions.model";
import { processCallback } from "../../src/transactions/transactions.service";

describe("Integration test: Service to process callback", () => {
  // Mocking model to create status
  modelTransaction.createStatus = jest.fn((status) => {
    const id = Date.now();
    return { id, ...status };
  });

  // Creating a payload
  const payload = {
    id: Date.now().toString(),
    name: 'rejected'
  }

  it("should return an object with status transaction", async () => {
    const data = await processCallback(payload);
    expect(data).toHaveProperty('id');
    expect(data).toHaveProperty('name', 'rejected');
    expect(data).toHaveProperty('transactionId');
  });
});