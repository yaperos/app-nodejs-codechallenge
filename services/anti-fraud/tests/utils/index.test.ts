import { jest, describe, expect, it } from "@jest/globals";
import { TransactionStatus } from "@my-org/common-tools";
import { evaluateTransaction } from "../../src/service";

describe("Test evaluateTransaction function", () => {
  it("should returns approved status", () => {
    const expectedStatus = TransactionStatus.Approved;
    const transactionEvent = {
      value: 900,
    };
    expect(evaluateTransaction(transactionEvent.value)).toBe(expectedStatus);
  });

  it("should returns rejected status", () => {
    const expectedStatus = TransactionStatus.Rejected;
    const transactionEvent = {
      value: 2000,
    };
    expect(evaluateTransaction(transactionEvent.value)).toBe(expectedStatus);
  });
});
