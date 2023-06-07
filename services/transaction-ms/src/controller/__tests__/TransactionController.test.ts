import { HttpEvent, KafkaEvent } from "libs";
import { Transaction, TransactionStatus } from "../../domain/Transaction";
import { TransactionServiceImpl } from "../../service/TransactionServiceImpl";
import { TransactionController } from "../TransactionController";

describe("TransactionController", () => {
  describe("findTransactionById", () => {
    it("should return transaction", async () => {
      const serviceMock = {
        findTransactionById: jest.fn(() => {
          const response = new Transaction({
            transactionExternalId: "f1b8a165-dfce-40ff-93cc-a54b867f0cd7",
            accountExternalIdDebit: "02929440-8a24-42d7-8293-f4c022e61057",
            accountExternalIdCredit: "be424844-b302-4af7-a7a4-11b832b686f8",
            value: 100,
            transferTypeId: 1,
            status: TransactionStatus.APPROVED,
            createdAt: 1686071339000,
          });
          return Promise.resolve(response);
        }),
      } as unknown as TransactionServiceImpl;

      const controller = new TransactionController({
        service: serviceMock,
      });

      const response = await controller.findTransactionById({
        params: {
          id: "f1b8a165-dfce-40ff-93cc-a54b867f0cd7",
        },
      } as unknown as HttpEvent);

      expect(serviceMock.findTransactionById).toBeCalledWith({
        transactionExternalId: "f1b8a165-dfce-40ff-93cc-a54b867f0cd7",
      });

      expect(response).toEqual({
        transactionExternalId: "f1b8a165-dfce-40ff-93cc-a54b867f0cd7",
        value: 100,
        transactionType: {
          name: "Bank Transfer",
        },
        transactionStatus: {
          name: "APPROVED",
        },
        createdAt: "2023-06-06T17:08:59.000Z",
      });
    });
  });

  describe("createTransaction", () => {
    it("should create transaction", async () => {
      const serviceMock = {
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
      } as unknown as TransactionServiceImpl;

      const controller = new TransactionController({
        service: serviceMock,
      });

      const response = await controller.createTransaction({
        method: "POST",
        routerPath: "/transaction",
        body: {
          accountExternalIdDebit: "02929440-8a24-42d7-8293-f4c022e61057",
          accountExternalIdCredit: "be424844-b302-4af7-a7a4-11b832b686f8",
          value: 100,
          transferTypeId: 1,
        },
      } as unknown as HttpEvent);

      expect(serviceMock.createTransaction).toBeCalledWith({
        accountExternalIdDebit: "02929440-8a24-42d7-8293-f4c022e61057",
        accountExternalIdCredit: "be424844-b302-4af7-a7a4-11b832b686f8",
        value: 100,
        transferTypeId: 1,
      });

      expect(response).toEqual({
        transactionExternalId: "f1b8a165-dfce-40ff-93cc-a54b867f0cd7",
        value: 100,
        transactionType: {
          name: "Bank Transfer",
        },
        transactionStatus: {
          name: "PENDING",
        },
        createdAt: "2023-06-06T17:08:59.000Z",
      });
    });
  });

  describe("processVerifyTransaction", () => {
    it("should procces transaction verification", async () => {
      const serviceMock = {
        processVerifyTransaction: jest.fn(() => {
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
      } as unknown as TransactionServiceImpl;

      const controller = new TransactionController({
        service: serviceMock,
      });

      const response = await controller.processVerifyTransaction({
        topic: "antifraud.transaction.update.done",
        value: {
          transaction: {
            transactionExternalId: "f1b8a165-dfce-40ff-93cc-a54b867f0cd7",
            value: 100,
            status: TransactionStatus.APPROVED,
          },
        },
      } as unknown as KafkaEvent);

      expect(serviceMock.processVerifyTransaction).toBeCalledWith({
        transactionExternalId: "f1b8a165-dfce-40ff-93cc-a54b867f0cd7",
        status: TransactionStatus.APPROVED,
      });

      expect(response).toEqual({
        transactionExternalId: "f1b8a165-dfce-40ff-93cc-a54b867f0cd7",
        accountExternalIdDebit: "02929440-8a24-42d7-8293-f4c022e61057",
        accountExternalIdCredit: "be424844-b302-4af7-a7a4-11b832b686f8",
        transferTypeId: 1,
        value: 100,
        status: TransactionStatus.PENDING,
        createdAt: 1686071339000,
      });
    });
  });
});
