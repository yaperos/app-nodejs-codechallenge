import { describe, expect, it, vi } from "vitest";
import { Antifraud } from "../../domain/antifraud";
import { Transaction } from "../../domain/transaction";

vi.setSystemTime(new Date("2020-01-01T00:00:00.000Z"));

describe("Transaction", () => {
  describe("verifyFraud", () => {
    it("should approve a transaction", async () => {
      // Prepare

      const transaction = new Transaction({
        transactionExternalId: "transactionExternalId",
        transactionType: {
          name: "debit",
        },
        transactionStatus: {
          name: "pending",
        },
        value: 100,
      });

      // Execute
      transaction.verifyFraud(
        new Antifraud({
          transaction: {
            transactionExternalId: "transactionExternalId",
          },
          score: 100,
        })
      );

      // Validate
      expect(transaction).toEqual(
        expect.objectContaining({
          transactionStatus: {
            name: "approved",
          },
        })
      );
    });

    it("should reject a transaction", async () => {
      // Prepare

      const transaction = new Transaction({
        transactionExternalId: "transactionExternalId",
        transactionType: {
          name: "debit",
        },
        transactionStatus: {
          name: "pending",
        },
        value: 100,
      });

      // Execute
      transaction.verifyFraud(
        new Antifraud({
          transaction: {
            transactionExternalId: "transactionExternalId",
          },
          score: 1800,
        })
      );

      // Validate
      expect(transaction).toEqual(
        expect.objectContaining({
          transactionStatus: {
            name: "rejected",
          },
        })
      );
    });

    it("should throw if transaction is in invalid state", async () => {
      // Prepare

      const transaction = new Transaction({
        transactionExternalId: "transactionExternalId",
        transactionType: {
          name: "debit",
        },
        transactionStatus: {
          name: "approved",
        },
        value: 100,
      });

      // Execute
      // Validate
      expect(() =>
        transaction.verifyFraud(
          new Antifraud({
            transaction: {
              transactionExternalId: "transactionExternalId",
            },
            score: 1800,
          })
        )
      ).toThrowError("Transaction already processed");
    });

    it("should throw if transaction and antifraud do not have the same id", async () => {
      // Prepare

      const transaction = new Transaction({
        transactionExternalId: "transactionExternalId",
        transactionType: {
          name: "debit",
        },
        transactionStatus: {
          name: "pending",
        },
        value: 100,
      });

      // Execute
      // Validate
      expect(() =>
        transaction.verifyFraud(
          new Antifraud({
            transaction: {
              transactionExternalId: "transactionExternalId2",
            },
            score: 1800,
          })
        )
      ).toThrowError("Invalid transaction");
    });
  });
});
