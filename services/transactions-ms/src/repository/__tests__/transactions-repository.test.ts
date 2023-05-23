import { eq } from "drizzle-orm";
import { describe, expect, it, vi } from "vitest";
import { mock } from "vitest-mock-extended";
import { Transaction } from "../../domain/transaction";
import {
  TransactionsRepository,
  type TransactionsRepositoryProps,
} from "../transactions-repository";

vi.setSystemTime(new Date("2020-01-01T00:00:00.000Z"));

vi.mock("drizzle-orm", () => ({
  eq: vi.fn(),
}));
vi.mock("../transactions-database", () => ({
  transactionsTable: {
    transactionExternalId: "tableTransactionExternalId",
  },
}));

describe("TransactionsRepository", () => {
  describe("createTransaction", () => {
    it("should create a transaction", async () => {
      // Prepare
      const valuesMock = vi.fn();

      const postgresClientMock = mock<
        TransactionsRepositoryProps["postgresClient"]
      >({
        insert: vi.fn().mockReturnValueOnce({
          values: valuesMock,
        }),
      });

      const transactionsRepository = new TransactionsRepository({
        postgresClient: postgresClientMock,
      });

      // Execute
      await transactionsRepository.createTransaction(
        new Transaction({
          transactionExternalId: "transactionExternalId",
          transactionType: {
            name: "credit",
          },
          transactionStatus: {
            name: "pending",
          },
          value: 100,
        })
      );

      // Validate
      expect(valuesMock).toHaveBeenCalledWith({
        transactionExternalId: "transactionExternalId",
        transactionTypeName: "credit",
        transactionStatusName: "pending",
        value: "100",
        createdAt: new Date("2020-01-01T00:00:00.000Z"),
      });
    });
  });

  describe("readTransaction", () => {
    it("should read a transaction", async () => {
      // Prepare
      const whereMock = vi.fn().mockReturnValueOnce([
        {
          transactionExternalId: "transactionExternalId",
          transactionTypeName: "credit",
          transactionStatusName: "pending",
          value: "100",
          createdAt: new Date("2020-01-01T00:00:00.000Z"),
        },
      ]);

      const postgresClientMock = mock<
        TransactionsRepositoryProps["postgresClient"]
      >({
        select: vi.fn().mockReturnValueOnce({
          from: vi.fn().mockReturnThis(),
          where: whereMock,
        }),
      });

      const transactionsRepository = new TransactionsRepository({
        postgresClient: postgresClientMock,
      });

      // Execute
      const response = await transactionsRepository.readTransaction({
        transactionExternalId: "transactionExternalId",
      });

      // Validate
      expect(response).toEqual({
        transactionExternalId: "transactionExternalId",
        transactionType: {
          name: "credit",
        },
        transactionStatus: {
          name: "pending",
        },
        value: 100,
        createdAt: new Date("2020-01-01T00:00:00.000Z"),
      });
      expect(eq).toHaveBeenCalledWith(
        "tableTransactionExternalId",
        "transactionExternalId"
      );
    });
  });

  describe("updateTransactionStatus", () => {
    it("should update a transaction status", async () => {
      // Prepare
      const setMock = vi.fn();

      const postgresClientMock = mock<
        TransactionsRepositoryProps["postgresClient"]
      >({
        update: vi.fn().mockReturnValueOnce({
          set: setMock.mockReturnThis(),
          where: vi.fn().mockReturnThis(),
        }),
      });

      const transactionsRepository = new TransactionsRepository({
        postgresClient: postgresClientMock,
      });

      // Execute
      await transactionsRepository.updateTransactionStatus(
        new Transaction({
          transactionExternalId: "transactionExternalId",
          transactionStatus: {
            name: "approved",
          },
          transactionType: {
            name: "credit",
          },
          value: 200,
        })
      );

      // Validate
      expect(setMock).toHaveBeenCalledWith({
        transactionStatusName: "approved",
        updatedAt: new Date("2020-01-01T00:00:00.000Z"),
      });
      expect(eq).toHaveBeenCalledWith(
        "tableTransactionExternalId",
        "transactionExternalId"
      );
    });
  });
});
