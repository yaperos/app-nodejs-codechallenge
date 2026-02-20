package yape.challenge.transaction_service.adapters.messaging.event;

import java.time.Instant;

public class StatusUpdatedEvent {
    public String transactionExternalId;
    public String status;
    public String reason;
    public Instant updatedAt;
}