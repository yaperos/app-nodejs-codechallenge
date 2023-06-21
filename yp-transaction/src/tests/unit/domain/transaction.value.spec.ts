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

    expect(eventValue.transactionExternalId).not.toBeUndefined();
    expect(eventValue.accountExternalIdDebit).toBe("12345");
    expect(eventValue.accountExternalIdCredit).toBe("123456");
    expect(eventValue.value).toBe(100);
    expect(eventValue.status).toBe(1);
    expect(eventValue.createdAt).not.toBeUndefined();
    expect(eventValue.createdAtTimestamp).not.toBeUndefined();
    expect(eventValue.updatedAt).toBeUndefined();
    expect(eventValue.updatedAtTimestamp).toBeUndefined();
  });
});