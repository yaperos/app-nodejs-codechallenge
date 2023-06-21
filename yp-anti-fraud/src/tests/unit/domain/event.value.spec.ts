import { EventValue } from "../../../domain/event.value";

describe("EventValue", () => {
  it("should create an instance with the correct properties", () => {
    const eventValue = new EventValue({
      transactionExternalId: "123456",
      accountExternalIdDebit: "654321",
      accountExternalIdCredit: "321654",
      value: 100,
    });

    expect(eventValue.transactionExternalId).toBe("123456");
    expect(eventValue.accountExternalIdDebit).toBe("654321");
    expect(eventValue.accountExternalIdCredit).toBe("321654");
    expect(eventValue.value).toBe(100);
  });
});