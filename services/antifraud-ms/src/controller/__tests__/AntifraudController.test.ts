import { KafkaEvent } from "libs";
import { Antifraud, TransactionStatus } from "../../domain/Antifraud";
import { AntifraudServiceImpl } from "../../service/AntifraudServiceImpl";
import { AntifraudController } from "../AntifraudController";

describe("AntifraudController", () => {
  describe("processVerifyTransaction", () => {
    it.only("should verify transaction", async () => {
      const serviceMock = {
        processVerifyTransaction: jest.fn(() => {
          const response = new Antifraud({
            transaction: {
              transactionExternalId: "f1b8a165-dfce-40ff-93cc-a54b867f0cd7",
              value: 100,
              status: TransactionStatus.APPROVED,
            },
          });
          return Promise.resolve(response);
        }),
      } as unknown as AntifraudServiceImpl;

      const controller = new AntifraudController({
        service: serviceMock,
      });

      const response = await controller.processVerifyTransaction({
        topic: "transaction.create.done",
        value: {
          transactionExternalId: "f1b8a165-dfce-40ff-93cc-a54b867f0cd7",
          value: 100,
          status: TransactionStatus.PENDING,
        },
      } as unknown as KafkaEvent);

      expect(serviceMock.processVerifyTransaction).toBeCalledWith({
        transaction: {
          transactionExternalId: "f1b8a165-dfce-40ff-93cc-a54b867f0cd7",
          value: 100,
          status: TransactionStatus.PENDING,
        },
      });

      expect(response).toEqual({
        transaction: {
          transactionExternalId: "f1b8a165-dfce-40ff-93cc-a54b867f0cd7",
          status: TransactionStatus.APPROVED,
        },
      });
    });
  });
});
