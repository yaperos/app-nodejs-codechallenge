package yape.challenge.common.events;

import java.time.Instant;

public class TransactionStatusUpdatedEvent {
    public String transactionExternalId;
    public String status;   // "approved" | "rejected"
    public String reason;
    public Instant updatedAt;
}