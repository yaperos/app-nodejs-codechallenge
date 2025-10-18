import { evaluateTransaction } from "../antifraud.processor";
import { TransactionCreatedEvent, TransactionStatusEvent } from "../../../messaging/events";
import { HIGH_VALUE_THRESHOLD } from "../../../constants/transactions";

describe("AntifraudProcessor", () => {
  describe("evaluateTransaction", () => {
    const baseEvent: TransactionCreatedEvent = {
      transactionExternalId: "test-transaction-123",
      accountExternalIdDebit: "account-debit-456",
      accountExternalIdCredit: "account-credit-789",
      value: 500
    };

    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date("2024-01-15T10:30:00.000Z"));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it("should approve transactions with value less than or equal to threshold", () => {
      // Arrange
      const event: TransactionCreatedEvent = {
        ...baseEvent,
        value: HIGH_VALUE_THRESHOLD
      };

      // Act
      const result = evaluateTransaction(event);

      // Assert
      const expected: TransactionStatusEvent = {
        transactionExternalId: "test-transaction-123",
        status: "approved",
        processedAt: "2024-01-15T10:30:00.000Z"
      };
      expect(result).toEqual(expected);
    });

    it("should reject transactions with value greater than threshold", () => {
      // Arrange
      const event: TransactionCreatedEvent = {
        ...baseEvent,
        value: HIGH_VALUE_THRESHOLD + 0.01
      };

      // Act
      const result = evaluateTransaction(event);

      // Assert
      const expected: TransactionStatusEvent = {
        transactionExternalId: "test-transaction-123",
        status: "rejected",
        processedAt: "2024-01-15T10:30:00.000Z"
      };
      expect(result).toEqual(expected);
    });

    it("should approve transactions with low values", () => {
      // Arrange
      const event: TransactionCreatedEvent = {
        ...baseEvent,
        value: 10.50
      };

      // Act
      const result = evaluateTransaction(event);

      // Assert
      expect(result.status).toBe("approved");
      expect(result.transactionExternalId).toBe("test-transaction-123");
    });

    it("should reject transactions with very high values", () => {
      // Arrange
      const event: TransactionCreatedEvent = {
        ...baseEvent,
        value: 100000
      };

      // Act
      const result = evaluateTransaction(event);

      // Assert
      expect(result.status).toBe("rejected");
      expect(result.transactionExternalId).toBe("test-transaction-123");
    });

    it("should include processing timestamp in result", () => {
      // Arrange & Act
      const result = evaluateTransaction(baseEvent);

      // Assert
      expect(result.processedAt).toBe("2024-01-15T10:30:00.000Z");
    });
  });
});