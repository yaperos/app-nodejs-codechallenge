import { EventManager } from "@app-nodejs-codechallenge/shared-lib";
import { type Producer } from "kafkajs";
import { describe, expect, it, vi } from "vitest";
import { mock } from "vitest-mock-extended";
import { Antifraud } from "../../domain/antifraud";
import { AntifraudService } from "../antifraud-service";

const mathFloorMock = vi.spyOn(Math, "floor");

describe("AntifraudService", () => {
  describe("processTransactionCreateEvent", () => {
    it("should process a transaction creation event", async () => {
      // Prepare
      const kafkaProducerMock = mock<Producer>();

      const antifraudService = new AntifraudService({
        eventManager: new EventManager({
          microservice: "antifraud",
          kafkaProducer: kafkaProducerMock,
        }),
      });

      mathFloorMock.mockReturnValueOnce(100);

      // Execute
      const response = await antifraudService.processTransactionCreateEvent(
        new Antifraud({
          transaction: {
            transactionExternalId: "transactionExternalId",
            transactionStatus: {
              name: "pending",
            },
          },
        })
      );

      // Validate
      expect(response).toEqual({
        score: 100,
        transaction: {
          transactionExternalId: "transactionExternalId",
          transactionStatus: {
            name: "pending",
          },
        },
      });
      expect(kafkaProducerMock.connect).toBeCalledTimes(1);
      expect(kafkaProducerMock.send).toBeCalledWith({
        topic: "antifraud.update.done",
        messages: [
          {
            value:
              '{"topic":"antifraud.update.done","source":"antifraud","action":"update","type":"done","payload":{"transaction":{"transactionExternalId":"transactionExternalId","transactionStatus":{"name":"pending"}},"score":100}}',
          },
        ],
      });
      expect(kafkaProducerMock.disconnect).toBeCalledTimes(1);
    });

    it("should throw a transaction in invalid state", async () => {
      // Prepare
      const kafkaProducerMock = mock<Producer>();

      const antifraudService = new AntifraudService({
        eventManager: new EventManager({
          microservice: "antifraud",
          kafkaProducer: kafkaProducerMock,
        }),
      });

      // Execute
      // Validate
      await expect(() =>
        antifraudService.processTransactionCreateEvent(
          new Antifraud({
            transaction: {
              transactionExternalId: "transactionExternalId",
              transactionStatus: {
                name: "approved",
              },
            },
          })
        )
      ).rejects.toThrowError("Transaction status is not pending");
      expect(kafkaProducerMock.connect).toBeCalledTimes(1);
      expect(kafkaProducerMock.send).toBeCalledWith({
        topic: "antifraud.update.failed",
        messages: [
          {
            value:
              '{"topic":"antifraud.update.failed","source":"antifraud","action":"update","type":"failed","error":{"message":"Transaction status is not pending","statusCode":400}}',
          },
        ],
      });
      expect(kafkaProducerMock.disconnect).toBeCalledTimes(1);
    });
  });
});
