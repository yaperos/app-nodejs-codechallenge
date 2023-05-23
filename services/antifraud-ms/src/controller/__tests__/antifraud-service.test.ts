import { randomUUID } from "node:crypto";
import { describe, expect, it } from "vitest";
import { mock } from "vitest-mock-extended";
import { AntifraudServiceI } from "../../service/antifraud-service.interface";
import { AntifraudController } from "../antifraud-controller";

describe("AntifraudController", () => {
  describe("processTransactionCreateEvent", () => {
    it("should process transaction creation event", async () => {
      // Prepare
      const serviceMock = mock<AntifraudServiceI>();

      const antifraudController = new AntifraudController({
        service: serviceMock,
      });

      // Execute
      const uuid = randomUUID();
      await antifraudController.processTransactionCreateEvent({
        topic: "transactions.create.done",
        value: JSON.stringify({
          topic: "transactions.create.done",
          source: "transactions",
          payload: {
            transactionExternalId: uuid,
            transactionStatus: {
              name: "pending",
            },
          },
        }),
      });

      // Validate
      expect(serviceMock.processTransactionCreateEvent).toBeCalledWith({
        transaction: {
          transactionExternalId: uuid,
          transactionStatus: {
            name: "pending",
          },
        },
      });
    });
  });
});
