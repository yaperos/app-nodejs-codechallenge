import { Producer } from "kafkajs";
import { EventManager } from "libs/src";
import { Transaction, TransactionStatus } from "../../domain/Transaction";
import { TransactionRepositoryImpl } from "../../repository/TransactionRepositoryImpl";
import { TransactionServiceImpl } from "../TransactionServiceImpl";

describe("TransactionServiceImpl", () => {
  describe("findTransactionById", () => {
    it("should return transaction", async () => {
      const repositoryMock = {
        findTransactionById: jest.fn(() => {
          const response = new Transaction({
            transactionExternalId: "f1b8a165-dfce-40ff-93cc-a54b867f0cd7",
            accountExternalIdDebit: "02929440-8a24-42d7-8293-f4c022e61057",
            accountExternalIdCredit: "be424844-b302-4af7-a7a4-11b832b686f8",
            value: 100,
            transferTypeId: 1,
            status: TransactionStatus.REJECTED,
            createdAt: 1686071339000,
          });
          return Promise.resolve(response);
        }),
      } as unknown as TransactionRepositoryImpl;

      const kafkaProducerMock = {
        connect: jest.fn(() => Promise.resolve()),
        send: jest.fn(() => Promise.resolve()),
        disconnect: jest.fn(() => Promise.resolve()),
      } as unknown as Producer;

      const service = new TransactionServiceImpl({
        repository: repositoryMock,
        kafkaEventManager: new EventManager({
          kafkaProducer: kafkaProducerMock,
          microservice: "transaction",
        }),
      });

      await service.findTransactionById(
        new Transaction({
          transactionExternalId: "f1b8a165-dfce-40ff-93cc-a54b867f0cd7",
        })
      );

      expect(repositoryMock.findTransactionById).toBeCalledWith({
        transactionExternalId: "f1b8a165-dfce-40ff-93cc-a54b867f0cd7",
      });

      expect(kafkaProducerMock.send).toBeCalledWith({
        messages: [
          {
            value:
              '{"transactionExternalId":"f1b8a165-dfce-40ff-93cc-a54b867f0cd7","accountExternalIdDebit":"02929440-8a24-42d7-8293-f4c022e61057","accountExternalIdCredit":"be424844-b302-4af7-a7a4-11b832b686f8","transferTypeId":1,"value":100,"status":"REJECTED","createdAt":1686071339000}',
          },
        ],
        topic: "transaction.request.done",
      });
    });
  });

  describe("createTransaction", () => {
    it("should create transaction", async () => {
      const repositoryMock = {
        createTransaction: jest.fn(() => {
          const response = new Transaction({
            transactionExternalId: "f1b8a165-dfce-40ff-93cc-a54b867f0cd7",
            accountExternalIdDebit: "02929440-8a24-42d7-8293-f4c022e61057",
            accountExternalIdCredit: "be424844-b302-4af7-a7a4-11b832b686f8",
            value: 100,
            transferTypeId: 1,
            status: TransactionStatus.PENDING,
            createdAt: 1686071339000,
          });
          return Promise.resolve(response);
        }),
      } as unknown as TransactionRepositoryImpl;

      const kafkaProducerMock = {
        connect: jest.fn(() => Promise.resolve()),
        send: jest.fn(() => Promise.resolve()),
        disconnect: jest.fn(() => Promise.resolve()),
      } as unknown as Producer;

      const service = new TransactionServiceImpl({
        repository: repositoryMock,
        kafkaEventManager: new EventManager({
          kafkaProducer: kafkaProducerMock,
          microservice: "transaction",
        }),
      });

      await service.createTransaction(
        new Transaction({
          accountExternalIdDebit: "02929440-8a24-42d7-8293-f4c022e61057",
          accountExternalIdCredit: "be424844-b302-4af7-a7a4-11b832b686f8",
          value: 100,
          transferTypeId: 1,
        })
      );

      expect(repositoryMock.createTransaction).toBeCalledWith({
        accountExternalIdDebit: "02929440-8a24-42d7-8293-f4c022e61057",
        accountExternalIdCredit: "be424844-b302-4af7-a7a4-11b832b686f8",
        value: 100,
        transferTypeId: 1,
      });

      expect(kafkaProducerMock.send).toBeCalledWith({
        messages: [
          {
            value:
              '{"transactionExternalId":"f1b8a165-dfce-40ff-93cc-a54b867f0cd7","accountExternalIdDebit":"02929440-8a24-42d7-8293-f4c022e61057","accountExternalIdCredit":"be424844-b302-4af7-a7a4-11b832b686f8","transferTypeId":1,"value":100,"status":"PENDING","createdAt":1686071339000}',
          },
        ],
        topic: "transaction.create.done",
      });
    });
  });

  describe("processVerifyTransaction", () => {
    it("should procces transaction verification", async () => {
      const repositoryMock = {
        updateTransaction: jest.fn(() =>
          Promise.resolve(
            new Transaction({
              transactionExternalId: "f1b8a165-dfce-40ff-93cc-a54b867f0cd7",
              accountExternalIdDebit: "02929440-8a24-42d7-8293-f4c022e61057",
              accountExternalIdCredit: "be424844-b302-4af7-a7a4-11b832b686f8",
              value: 100,
              transferTypeId: 1,
              status: TransactionStatus.APPROVED,
              createdAt: 1686071339000,
              updatedAt: 1686071339000,
            })
          )
        ),
      } as unknown as TransactionRepositoryImpl;

      const kafkaProducerMock = {
        connect: jest.fn(() => Promise.resolve()),
        send: jest.fn(() => Promise.resolve()),
        disconnect: jest.fn(() => Promise.resolve()),
      } as unknown as Producer;

      const service = new TransactionServiceImpl({
        repository: repositoryMock,
        kafkaEventManager: new EventManager({
          kafkaProducer: kafkaProducerMock,
          microservice: "transaction",
        }),
      });

      await service.processVerifyTransaction(
        new Transaction({
          transactionExternalId: "f1b8a165-dfce-40ff-93cc-a54b867f0cd7",
          status: TransactionStatus.APPROVED,
        })
      );

      expect(repositoryMock.updateTransaction).toBeCalledWith({
        transactionExternalId: "f1b8a165-dfce-40ff-93cc-a54b867f0cd7",
        status: TransactionStatus.APPROVED,
      });

      expect(kafkaProducerMock.send).toBeCalledWith({
        messages: [
          {
            value:
              '{"transactionExternalId":"f1b8a165-dfce-40ff-93cc-a54b867f0cd7","status":"APPROVED"}',
          },
        ],
        topic: "transaction.update.done",
      });
    });
  });
});
