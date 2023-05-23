import { EventManager } from "@app-nodejs-codechallenge/shared-lib";
import { type Producer } from "kafkajs";
import { describe, expect, it, vi } from "vitest";
import { mock } from "vitest-mock-extended";
import { Antifraud } from "../../domain/antifraud";
import { Transaction } from "../../domain/transaction";
import { TransactionsRepositoryI } from "../../repository/transactions-repository.interface";
import { TransactionsService } from "../transactions-service";

vi.setSystemTime(new Date("2020-01-01T00:00:00.000Z"));

describe("TransactionsService", () => {
  describe("createTransaction", () => {
    it("should create a transaction", async () => {
      // Prepare
      const repositoryMock = mock<TransactionsRepositoryI>();
      const kafkaProducerMock = mock<Producer>();

      const transactionsService = new TransactionsService({
        repository: repositoryMock,
        eventManager: new EventManager({
          microservice: "transactions",
          kafkaProducer: kafkaProducerMock,
        }),
      });

      // Execute
      await transactionsService.createTransaction(
        new Transaction({
          transactionExternalId: "transactionExternalId",
          transactionType: {
            name: "debit",
          },
          transactionStatus: {
            name: "pending",
          },
          value: 100,
        })
      );

      // Validate
      expect(repositoryMock.createTransaction).toBeCalledWith({
        transactionExternalId: "transactionExternalId",
        transactionType: {
          name: "debit",
        },
        transactionStatus: {
          name: "pending",
        },
        value: 100,
      });
      expect(kafkaProducerMock.connect).toBeCalledTimes(1);
      expect(kafkaProducerMock.send).toBeCalledWith({
        topic: "transactions.create.done",
        messages: [
          {
            value:
              '{"topic":"transactions.create.done","source":"transactions","action":"create","type":"done","payload":{"transactionExternalId":"transactionExternalId","transactionType":{"name":"debit"},"transactionStatus":{"name":"pending"},"value":100}}',
          },
        ],
      });
      expect(kafkaProducerMock.disconnect).toBeCalledTimes(1);
    });
  });

  describe("readTransaction", () => {
    it("should read a transaction", async () => {
      // Prepare
      const repositoryMock = mock<TransactionsRepositoryI>();
      repositoryMock.readTransaction.mockResolvedValue(
        new Transaction({
          transactionExternalId: "transactionExternalId",
          transactionType: {
            name: "debit",
          },
          transactionStatus: {
            name: "approved",
          },
          value: 200,
          createdAt: new Date("2020-01-01T00:00:00.000Z"),
          updatedAt: new Date("2020-01-02T00:00:00.000Z"),
        })
      );

      const kafkaProducerMock = mock<Producer>();

      const transactionsService = new TransactionsService({
        repository: repositoryMock,
        eventManager: new EventManager({
          microservice: "transactions",
          kafkaProducer: kafkaProducerMock,
        }),
      });

      // Execute
      const response = await transactionsService.readTransaction({
        transactionExternalId: "transactionExternalId",
      });

      // Validate
      expect(response).toEqual({
        transactionExternalId: "transactionExternalId",
        transactionType: {
          name: "debit",
        },
        transactionStatus: {
          name: "approved",
        },
        value: 200,
        createdAt: new Date("2020-01-01T00:00:00.000Z"),
        updatedAt: new Date("2020-01-02T00:00:00.000Z"),
      });
      expect(repositoryMock.readTransaction).toBeCalledWith({
        transactionExternalId: "transactionExternalId",
      });
      expect(kafkaProducerMock.connect).toBeCalledTimes(1);
      expect(kafkaProducerMock.send).toBeCalledWith({
        topic: "transactions.read.done",
        messages: [
          {
            value:
              '{"topic":"transactions.read.done","source":"transactions","action":"read","type":"done","payload":{"transactionExternalId":"transactionExternalId","transactionType":{"name":"debit"},"transactionStatus":{"name":"approved"},"value":200,"createdAt":"2020-01-01T00:00:00.000Z","updatedAt":"2020-01-02T00:00:00.000Z"}}',
          },
        ],
      });
      expect(kafkaProducerMock.disconnect).toBeCalledTimes(1);
    });
  });

  describe("processTransactionUpdateEvent", () => {
    it("should process transaction update event with approved score", async () => {
      // Prepare
      const repositoryMock = mock<TransactionsRepositoryI>();
      repositoryMock.readTransaction.mockResolvedValue(
        new Transaction({
          transactionExternalId: "transactionExternalId",
          transactionType: {
            name: "debit",
          },
          transactionStatus: {
            name: "pending",
          },
          value: 200,
          createdAt: new Date("2020-01-01T00:00:00.000Z"),
        })
      );

      const kafkaProducerMock = mock<Producer>();

      const transactionsService = new TransactionsService({
        repository: repositoryMock,
        eventManager: new EventManager({
          microservice: "transactions",
          kafkaProducer: kafkaProducerMock,
        }),
      });

      // Execute
      await transactionsService.processTransactionUpdateEvent(
        new Antifraud({
          transaction: {
            transactionExternalId: "transactionExternalId",
          },
          score: 420,
        })
      );

      // Validate
      expect(repositoryMock.readTransaction).toBeCalledWith({
        transactionExternalId: "transactionExternalId",
      });
      expect(repositoryMock.updateTransactionStatus).toBeCalledWith({
        transactionExternalId: "transactionExternalId",
        transactionType: {
          name: "debit",
        },
        transactionStatus: {
          name: "approved",
        },
        value: 200,
        createdAt: new Date("2020-01-01T00:00:00.000Z"),
      });
      expect(kafkaProducerMock.connect).toBeCalledTimes(1);
      expect(kafkaProducerMock.send).toBeCalledWith({
        topic: "transactions.update.done",
        messages: [
          {
            value:
              '{"topic":"transactions.update.done","source":"transactions","action":"update","type":"done","payload":{"transactionExternalId":"transactionExternalId","transactionType":{"name":"debit"},"transactionStatus":{"name":"approved"},"value":200,"createdAt":"2020-01-01T00:00:00.000Z"}}',
          },
        ],
      });
      expect(kafkaProducerMock.disconnect).toBeCalledTimes(1);
    });

    it("should process transaction update event with rejected score", async () => {
      // Prepare
      const repositoryMock = mock<TransactionsRepositoryI>();
      repositoryMock.readTransaction.mockResolvedValue(
        new Transaction({
          transactionExternalId: "transactionExternalId",
          transactionType: {
            name: "debit",
          },
          transactionStatus: {
            name: "pending",
          },
          value: 200,
          createdAt: new Date("2020-01-01T00:00:00.000Z"),
        })
      );

      const kafkaProducerMock = mock<Producer>();

      const transactionsService = new TransactionsService({
        repository: repositoryMock,
        eventManager: new EventManager({
          microservice: "transactions",
          kafkaProducer: kafkaProducerMock,
        }),
      });

      // Execute
      await transactionsService.processTransactionUpdateEvent(
        new Antifraud({
          transaction: {
            transactionExternalId: "transactionExternalId",
          },
          score: 1200,
        })
      );

      // Validate
      expect(repositoryMock.readTransaction).toBeCalledWith({
        transactionExternalId: "transactionExternalId",
      });
      expect(repositoryMock.updateTransactionStatus).toBeCalledWith({
        transactionExternalId: "transactionExternalId",
        transactionType: {
          name: "debit",
        },
        transactionStatus: {
          name: "rejected",
        },
        value: 200,
        createdAt: new Date("2020-01-01T00:00:00.000Z"),
      });
      expect(kafkaProducerMock.connect).toBeCalledTimes(1);
      expect(kafkaProducerMock.send).toBeCalledWith({
        topic: "transactions.update.done",
        messages: [
          {
            value:
              '{"topic":"transactions.update.done","source":"transactions","action":"update","type":"done","payload":{"transactionExternalId":"transactionExternalId","transactionType":{"name":"debit"},"transactionStatus":{"name":"rejected"},"value":200,"createdAt":"2020-01-01T00:00:00.000Z"}}',
          },
        ],
      });
      expect(kafkaProducerMock.disconnect).toBeCalledTimes(1);
    });

    it("should throw transaction update event when is already processed", async () => {
      // Prepare
      const repositoryMock = mock<TransactionsRepositoryI>();
      repositoryMock.readTransaction.mockResolvedValue(
        new Transaction({
          transactionExternalId: "transactionExternalId",
          transactionType: {
            name: "debit",
          },
          transactionStatus: {
            name: "approved",
          },
          value: 200,
          createdAt: new Date("2020-01-01T00:00:00.000Z"),
        })
      );

      const kafkaProducerMock = mock<Producer>();

      const transactionsService = new TransactionsService({
        repository: repositoryMock,
        eventManager: new EventManager({
          microservice: "transactions",
          kafkaProducer: kafkaProducerMock,
        }),
      });

      // Execute
      await expect(() =>
        transactionsService.processTransactionUpdateEvent(
          new Antifraud({
            transaction: {
              transactionExternalId: "transactionExternalId",
            },
            score: 1200,
          })
        )
      ).rejects.toThrow("Transaction is already processed");

      // Validate
      expect(repositoryMock.readTransaction).toBeCalledWith({
        transactionExternalId: "transactionExternalId",
      });
      expect(repositoryMock.updateTransactionStatus).not.toBeCalled();
      expect(kafkaProducerMock.connect).toBeCalledTimes(1);
      expect(kafkaProducerMock.send).toBeCalledWith({
        topic: "transactions.update.failed",
        messages: [
          {
            value:
              '{"topic":"transactions.update.failed","source":"transactions","action":"update","type":"failed","error":{"message":"Transaction is already processed","statusCode":400}}',
          },
        ],
      });
      expect(kafkaProducerMock.disconnect).toBeCalledTimes(1);
    });
  });
});
