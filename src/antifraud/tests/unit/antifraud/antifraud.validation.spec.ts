import { parseTransactionCreatedEvent } from "../../../modules/antifraud/antifraud.validation";

const buildPayload = () => ({
  transactionExternalId: "1b4e28ba-2fa1-11d2-883f-0016d3cca427",
  accountExternalIdDebit: "11111111-1111-1111-1111-111111111111",
  accountExternalIdCredit: "22222222-2222-2222-2222-222222222222",
  transferTypeId: 1,
  value: 120,
  createdAt: new Date().toISOString()
});

describe("parseTransactionCreatedEvent", () => {
  it("accepts valid payloads", () => {
    const result = parseTransactionCreatedEvent(buildPayload());
    expect(result.success).toBe(true);
  });

  it("rejects invalid UUIDs", () => {
    const payload = {
      ...buildPayload(),
      transactionExternalId: "not-uuid"
    };

    const result = parseTransactionCreatedEvent(payload);
    expect(result.success).toBe(false);
  });

  it("rejects invalid numeric values", () => {
    const payload = {
      ...buildPayload(),
      transferTypeId: 0,
      value: -1
    };

    const result = parseTransactionCreatedEvent(payload);
    expect(result.success).toBe(false);
  });

  it("rejects invalid timestamps", () => {
    const payload = {
      ...buildPayload(),
      createdAt: "invalid-date"
    };

    const result = parseTransactionCreatedEvent(payload);
    expect(result.success).toBe(false);
  });
});
