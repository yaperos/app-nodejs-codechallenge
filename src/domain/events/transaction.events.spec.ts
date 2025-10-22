import {
  TransactionCreatedEvent,
  TransactionProcessingEvent,
  TransactionCompletedEvent,
  TransactionFailedEvent,
  TransactionRejectedEvent,
  TransactionReversedEvent,
  AntifraudCheckRequestedEvent,
  AntifraudCheckCompletedEvent,
} from "./transaction.events";

describe("Domain Events", () => {
  const mockAggregateId = "aggregate-123";
  const mockTransactionId = "txn-123";

  describe("DomainEvent Base Class", () => {
    let event: TransactionCreatedEvent;

    beforeEach(() => {
      event = new TransactionCreatedEvent(
        mockAggregateId,
        mockTransactionId,
        "ext-123",
        "P2P",
        100,
        "PEN",
        "source-acc",
        "target-acc",
        { description: "test" }
      );
    });

    it("should generate unique event ID", () => {
      const event1 = new TransactionCreatedEvent(
        mockAggregateId,
        "txn-1",
        "ext-1",
        "P2P",
        100,
        "PEN",
        "source",
        "target",
        {}
      );
      const event2 = new TransactionCreatedEvent(
        mockAggregateId,
        "txn-2",
        "ext-2",
        "P2P",
        200,
        "PEN",
        "source",
        "target",
        {}
      );

      expect(event1.eventId).not.toBe(event2.eventId);
      expect(event1.eventId).toBeTruthy();
      expect(event2.eventId).toBeTruthy();
    });

    it("should set occurredAt timestamp", () => {
      expect(event.occurredAt).toBeInstanceOf(Date);
      expect(event.occurredAt.getTime()).toBeLessThanOrEqual(Date.now());
    });

    it("should set aggregate ID", () => {
      expect(event.aggregateId).toBe(mockAggregateId);
    });

    it("should set event type", () => {
      expect(event.eventType).toBe("TransactionCreated");
    });

    it("should default version to 1", () => {
      expect(event.version).toBe(1);
    });

    it("should serialize to JSON correctly", () => {
      const json = event.toJSON();

      expect(json.eventId).toBe(event.eventId);
      expect(json.eventType).toBe("TransactionCreated");
      expect(json.aggregateId).toBe(mockAggregateId);
      expect(json.occurredAt).toBe(event.occurredAt.toISOString());
      expect(json.version).toBe(1);
      expect(json.payload).toBeDefined();
    });
  });

  describe("TransactionCreatedEvent", () => {
    it("should create event with all properties", () => {
      const metadata = { userId: 123, device: "mobile" };
      const event = new TransactionCreatedEvent(
        mockAggregateId,
        mockTransactionId,
        "ext-123",
        "P2P",
        100,
        "PEN",
        "source-acc",
        "target-acc",
        metadata
      );

      expect(event.eventType).toBe("TransactionCreated");
      expect(event.transactionId).toBe(mockTransactionId);
      expect(event.externalId).toBe("ext-123");
      expect(event.type).toBe("P2P");
      expect(event.amount).toBe(100);
      expect(event.currency).toBe("PEN");
      expect(event.sourceAccountId).toBe("source-acc");
      expect(event.targetAccountId).toBe("target-acc");
      expect(event.metadata).toEqual(metadata);
    });

    it("should return correct payload", () => {
      const metadata = { description: "test" };
      const event = new TransactionCreatedEvent(
        mockAggregateId,
        mockTransactionId,
        "ext-123",
        "PAYMENT",
        250.5,
        "USD",
        "source-acc",
        "target-acc",
        metadata
      );

      const payload = event.getPayload();

      expect(payload.transactionId).toBe(mockTransactionId);
      expect(payload.externalId).toBe("ext-123");
      expect(payload.type).toBe("PAYMENT");
      expect(payload.amount).toBe(250.5);
      expect(payload.currency).toBe("USD");
      expect(payload.sourceAccountId).toBe("source-acc");
      expect(payload.targetAccountId).toBe("target-acc");
      expect(payload.metadata).toEqual(metadata);
    });
  });

  describe("TransactionProcessingEvent", () => {
    it("should create event with transaction ID", () => {
      const event = new TransactionProcessingEvent(
        mockAggregateId,
        mockTransactionId
      );

      expect(event.eventType).toBe("TransactionProcessing");
      expect(event.transactionId).toBe(mockTransactionId);
    });

    it("should return correct payload", () => {
      const event = new TransactionProcessingEvent(
        mockAggregateId,
        mockTransactionId
      );

      const payload = event.getPayload();

      expect(payload.transactionId).toBe(mockTransactionId);
      expect(Object.keys(payload)).toHaveLength(1);
    });
  });

  describe("TransactionCompletedEvent", () => {
    it("should create event with completion timestamp", () => {
      const completedAt = new Date("2025-01-01T12:00:00Z");
      const event = new TransactionCompletedEvent(
        mockAggregateId,
        mockTransactionId,
        completedAt
      );

      expect(event.eventType).toBe("TransactionCompleted");
      expect(event.transactionId).toBe(mockTransactionId);
      expect(event.completedAt).toBe(completedAt);
    });

    it("should return correct payload with ISO date string", () => {
      const completedAt = new Date("2025-01-01T12:00:00Z");
      const event = new TransactionCompletedEvent(
        mockAggregateId,
        mockTransactionId,
        completedAt
      );

      const payload = event.getPayload();

      expect(payload.transactionId).toBe(mockTransactionId);
      expect(payload.completedAt).toBe(completedAt.toISOString());
    });
  });

  describe("TransactionFailedEvent", () => {
    it("should create event with failure reason", () => {
      const reason = "Network timeout";
      const event = new TransactionFailedEvent(
        mockAggregateId,
        mockTransactionId,
        reason
      );

      expect(event.eventType).toBe("TransactionFailed");
      expect(event.transactionId).toBe(mockTransactionId);
      expect(event.failureReason).toBe(reason);
    });

    it("should return correct payload", () => {
      const reason = "Payment gateway error";
      const event = new TransactionFailedEvent(
        mockAggregateId,
        mockTransactionId,
        reason
      );

      const payload = event.getPayload();

      expect(payload.transactionId).toBe(mockTransactionId);
      expect(payload.failureReason).toBe(reason);
    });
  });

  describe("TransactionRejectedEvent", () => {
    it("should create event with rejection reason", () => {
      const reason = "Antifraud check failed";
      const event = new TransactionRejectedEvent(
        mockAggregateId,
        mockTransactionId,
        reason
      );

      expect(event.eventType).toBe("TransactionRejected");
      expect(event.transactionId).toBe(mockTransactionId);
      expect(event.rejectionReason).toBe(reason);
      expect(event.antifraudScore).toBeUndefined();
    });

    it("should create event with antifraud score", () => {
      const reason = "High risk transaction";
      const score = 95;
      const event = new TransactionRejectedEvent(
        mockAggregateId,
        mockTransactionId,
        reason,
        score
      );

      expect(event.rejectionReason).toBe(reason);
      expect(event.antifraudScore).toBe(score);
    });

    it("should return correct payload with score", () => {
      const event = new TransactionRejectedEvent(
        mockAggregateId,
        mockTransactionId,
        "Risk detected",
        85
      );

      const payload = event.getPayload();

      expect(payload.transactionId).toBe(mockTransactionId);
      expect(payload.rejectionReason).toBe("Risk detected");
      expect(payload.antifraudScore).toBe(85);
    });

    it("should return correct payload without score", () => {
      const event = new TransactionRejectedEvent(
        mockAggregateId,
        mockTransactionId,
        "Validation failed"
      );

      const payload = event.getPayload();

      expect(payload.antifraudScore).toBeUndefined();
    });
  });

  describe("TransactionReversedEvent", () => {
    it("should create event with reversal details", () => {
      const reversalId = "reversal-456";
      const reversedAt = new Date("2025-01-02T15:00:00Z");
      const event = new TransactionReversedEvent(
        mockAggregateId,
        mockTransactionId,
        reversalId,
        reversedAt
      );

      expect(event.eventType).toBe("TransactionReversed");
      expect(event.transactionId).toBe(mockTransactionId);
      expect(event.reversalTransactionId).toBe(reversalId);
      expect(event.reversedAt).toBe(reversedAt);
    });

    it("should return correct payload with ISO date string", () => {
      const reversalId = "reversal-789";
      const reversedAt = new Date("2025-01-02T15:00:00Z");
      const event = new TransactionReversedEvent(
        mockAggregateId,
        mockTransactionId,
        reversalId,
        reversedAt
      );

      const payload = event.getPayload();

      expect(payload.transactionId).toBe(mockTransactionId);
      expect(payload.reversalTransactionId).toBe(reversalId);
      expect(payload.reversedAt).toBe(reversedAt.toISOString());
    });
  });

  describe("AntifraudCheckRequestedEvent", () => {
    it("should create event with antifraud check details", () => {
      const event = new AntifraudCheckRequestedEvent(
        mockAggregateId,
        mockTransactionId,
        500,
        "source-123",
        "target-456"
      );

      expect(event.eventType).toBe("AntifraudCheckRequested");
      expect(event.transactionId).toBe(mockTransactionId);
      expect(event.amount).toBe(500);
      expect(event.sourceAccountId).toBe("source-123");
      expect(event.targetAccountId).toBe("target-456");
    });

    it("should return correct payload", () => {
      const event = new AntifraudCheckRequestedEvent(
        mockAggregateId,
        mockTransactionId,
        1200,
        "source-acc",
        "target-acc"
      );

      const payload = event.getPayload();

      expect(payload.transactionId).toBe(mockTransactionId);
      expect(payload.amount).toBe(1200);
      expect(payload.sourceAccountId).toBe("source-acc");
      expect(payload.targetAccountId).toBe("target-acc");
    });
  });

  describe("AntifraudCheckCompletedEvent", () => {
    it("should create event with check results", () => {
      const event = new AntifraudCheckCompletedEvent(
        mockAggregateId,
        mockTransactionId,
        45,
        "APPROVED"
      );

      expect(event.eventType).toBe("AntifraudCheckCompleted");
      expect(event.transactionId).toBe(mockTransactionId);
      expect(event.score).toBe(45);
      expect(event.status).toBe("APPROVED");
    });

    it("should handle rejected status", () => {
      const event = new AntifraudCheckCompletedEvent(
        mockAggregateId,
        mockTransactionId,
        95,
        "REJECTED"
      );

      expect(event.score).toBe(95);
      expect(event.status).toBe("REJECTED");
    });

    it("should return correct payload", () => {
      const event = new AntifraudCheckCompletedEvent(
        mockAggregateId,
        mockTransactionId,
        60,
        "PENDING_REVIEW"
      );

      const payload = event.getPayload();

      expect(payload.transactionId).toBe(mockTransactionId);
      expect(payload.score).toBe(60);
      expect(payload.status).toBe("PENDING_REVIEW");
    });
  });

  describe("Event Serialization", () => {
    it("should serialize all events to JSON with consistent structure", () => {
      const events = [
        new TransactionCreatedEvent(
          mockAggregateId,
          "txn-1",
          "ext-1",
          "P2P",
          100,
          "PEN",
          "src",
          "tgt",
          {}
        ),
        new TransactionProcessingEvent(mockAggregateId, "txn-1"),
        new TransactionCompletedEvent(mockAggregateId, "txn-1", new Date()),
        new TransactionFailedEvent(mockAggregateId, "txn-1", "error"),
        new TransactionRejectedEvent(mockAggregateId, "txn-1", "rejected"),
        new TransactionReversedEvent(
          mockAggregateId,
          "txn-1",
          "rev-1",
          new Date()
        ),
        new AntifraudCheckRequestedEvent(
          mockAggregateId,
          "txn-1",
          100,
          "src",
          "tgt"
        ),
        new AntifraudCheckCompletedEvent(
          mockAggregateId,
          "txn-1",
          50,
          "APPROVED"
        ),
      ];

      events.forEach((event) => {
        const json = event.toJSON();

        expect(json).toHaveProperty("eventId");
        expect(json).toHaveProperty("eventType");
        expect(json).toHaveProperty("aggregateId");
        expect(json).toHaveProperty("occurredAt");
        expect(json).toHaveProperty("version");
        expect(json).toHaveProperty("payload");

        expect(typeof json.eventId).toBe("string");
        expect(typeof json.eventType).toBe("string");
        expect(typeof json.aggregateId).toBe("string");
        expect(typeof json.occurredAt).toBe("string");
        expect(typeof json.version).toBe("number");
        expect(typeof json.payload).toBe("object");
      });
    });
  });
});
