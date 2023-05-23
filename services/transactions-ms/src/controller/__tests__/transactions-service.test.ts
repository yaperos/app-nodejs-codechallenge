import { randomUUID } from "node:crypto";
import { describe, expect, it, vi } from "vitest";
import { mock } from "vitest-mock-extended";
import { Antifraud } from "../../domain/antifraud";
import { Transaction } from "../../domain/transaction";
import { TransactionsServiceI } from "../../service/transactions-service.interface";
import { TransactionsController } from "../transactions-controller";

vi.setSystemTime(new Date("2020-01-01T00:00:00.000Z"));

describe("TransactionsController", () => {
  describe("createTransaction", () => {
    it("should create a debit transaction", async () => {
      // Prepare
      const serviceMock = mock<TransactionsServiceI>();

      const transactionsController = new TransactionsController({
        service: serviceMock,
      });

      // Execute
      const uuid = randomUUID();
      await transactionsController.createTransaction({
        method: "POST",
        route: "/transactions",
        pathParameters: {},
        queryStringParameters: {},
        body: JSON.stringify({
          accountExternalIdDebit: uuid,
          transferTypeId: 1,
          value: 420,
        }),
      });

      // Validate
      expect(serviceMock.createTransaction).toBeCalledWith({
        transactionExternalId: uuid,
        transactionType: {
          name: "debit",
        },
        transactionStatus: {
          name: "pending",
        },
        value: 420,
      });
    });

    it("should create a credit transaction", async () => {
      // Prepare
      const serviceMock = mock<TransactionsServiceI>();

      const transactionsController = new TransactionsController({
        service: serviceMock,
      });

      // Execute
      const uuid = randomUUID();
      await transactionsController.createTransaction({
        method: "POST",
        route: "/transactions",
        pathParameters: {},
        queryStringParameters: {},
        body: JSON.stringify({
          accountExternalIdCredit: uuid,
          transferTypeId: 2,
          value: 420,
        }),
      });

      // Validate
      expect(serviceMock.createTransaction).toBeCalledWith({
        transactionExternalId: uuid,
        transactionType: {
          name: "credit",
        },
        transactionStatus: {
          name: "pending",
        },
        value: 420,
      });
    });

    it("should not create an unknown transaction", async () => {
      // Prepare
      const serviceMock = mock<TransactionsServiceI>();

      const transactionsController = new TransactionsController({
        service: serviceMock,
      });

      // Execute
      // Validate
      expect(() =>
        transactionsController.createTransaction({
          method: "POST",
          route: "/transactions",
          pathParameters: {},
          queryStringParameters: {},
          body: JSON.stringify({
            accountExternalIdCredit: randomUUID(),
            transferTypeId: 3,
            value: 420,
          }),
        })
      ).toThrowError(
        expect.objectContaining({
          issues: expect.arrayContaining([
            expect.objectContaining({ code: "invalid_union_discriminator" }),
          ]),
        })
      );
    });
  });

  describe("readTransaction", () => {
    it("should read a transaction", async () => {
      // Prepare
      const uuid = randomUUID();

      const serviceMock = mock<TransactionsServiceI>();
      serviceMock.readTransaction.mockResolvedValue(
        new Transaction({
          transactionExternalId: uuid,
          transactionType: {
            name: "debit",
          },
          transactionStatus: {
            name: "pending",
          },
          value: 420,
          createdAt: new Date("2020-01-01T00:00:00.000Z"),
        })
      );

      const transactionsController = new TransactionsController({
        service: serviceMock,
      });

      // Execute
      const response = await transactionsController.readTransaction({
        method: "POST",
        route: "/transactions/:id",
        pathParameters: {
          id: uuid,
        },
        queryStringParameters: {},
      });

      // Validate
      expect(response).toEqual({
        transactionExternalId: uuid,
        transactionType: {
          name: "debit",
        },
        transactionStatus: {
          name: "pending",
        },
        value: 420,
        createdAt: new Date("2020-01-01T00:00:00.000Z"),
      });
      expect(serviceMock.readTransaction).toBeCalledWith({
        transactionExternalId: uuid,
      });
    });
  });

  describe("processTransactionUpdateEvent", () => {
    it("should process a transaction update event", async () => {
      // Prepare
      const uuid = randomUUID();

      const serviceMock = mock<TransactionsServiceI>();
      serviceMock.processTransactionUpdateEvent.mockResolvedValue(
        new Transaction({
          transactionExternalId: uuid,
          transactionType: {
            name: "debit",
          },
          transactionStatus: {
            name: "approved",
          },
          value: 100,
          createdAt: new Date("2020-01-01T00:00:00.000Z"),
        })
      );

      const transactionsController = new TransactionsController({
        service: serviceMock,
      });

      // Execute
      const response =
        await transactionsController.processTransactionUpdateEvent({
          topic: "antifraud.update.done",
          value: JSON.stringify({
            topic: "antifraud.update.done",
            source: "antifraud",
            payload: {
              transaction: {
                transactionExternalId: uuid,
              },
              score: 420,
            },
          }),
        });

      // Validate
      expect(response).toEqual({
        transactionExternalId: uuid,
        transactionType: {
          name: "debit",
        },
        transactionStatus: {
          name: "approved",
        },
        value: 100,
        createdAt: new Date("2020-01-01T00:00:00.000Z"),
      });
      expect(serviceMock.processTransactionUpdateEvent).toBeCalledWith(
        new Antifraud({
          transaction: {
            transactionExternalId: uuid,
          },
          score: 420,
        })
      );
    });
  });
});
