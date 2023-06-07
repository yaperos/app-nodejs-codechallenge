import { Producer } from "kafkajs";
import { EventManager } from "libs/src";
import { Antifraud, TransactionStatus } from "../../domain/Antifraud";
import { AntifraudServiceImpl } from "../AntifraudServiceImpl";

describe("AntifraudServiceImpl", () => {
  describe("processVerifyTransaction", () => {
    it("should verify transaction", async () => {
      const kafkaProducerMock = {
        connect: jest.fn(() => Promise.resolve()),
        send: jest.fn(() => Promise.resolve()),
        disconnect: jest.fn(() => Promise.resolve()),
      } as unknown as Producer;

      const service = new AntifraudServiceImpl({
        kafkaEventManager: new EventManager({
          kafkaProducer: kafkaProducerMock,
          microservice: "antifraud",
        }),
        featureFlags: {
          maxAmount: 1000,
        },
      });

      await service.processVerifyTransaction(
        new Antifraud({
          transaction: {
            transactionExternalId: "f1b8a165-dfce-40ff-93cc-a54b867f0cd7",
            value: 100,
            status: TransactionStatus.PENDING,
          },
        })
      );

      expect(kafkaProducerMock.send).toBeCalledWith({
        messages: [
          {
            value:
              '{"transaction":{"transactionExternalId":"f1b8a165-dfce-40ff-93cc-a54b867f0cd7","status":"APPROVED"}}',
          },
        ],
        topic: "antifraud.transaction.update.done",
      });
    });
  });
});
