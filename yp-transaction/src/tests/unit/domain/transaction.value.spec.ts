import { TransactionValue } from "../../../domain/transaction.value";

describe("EventValue", () => {
  it("should create an instance with the correct properties", () => {

    const eventValue = new TransactionValue({
      accountExternalIdDebit: "12345",
      accountExternalIdCredit: "123456",
      status: 1,
      value: 100,
      tranferTypeId: 1,

    });

    expect(eventValue).toEqual(
      expect.objectContaining({
        transactionExternalId: expect.any(String),
        accountExternalIdDebit: "12345",
        accountExternalIdCredit: "123456",
        value: 100,
        status: 1,
        createdAt: expect.any(String),
        createdAtTimestamp: expect.any(Number),
      })
    )

    expect(eventValue.updatedAt).toBeUndefined();
    expect(eventValue.updatedAtTimestamp).toBeUndefined();
  });
});