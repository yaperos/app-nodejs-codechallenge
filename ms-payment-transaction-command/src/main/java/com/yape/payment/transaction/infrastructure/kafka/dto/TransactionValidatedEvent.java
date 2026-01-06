package com.yape.payment.transaction.infrastructure.kafka.dto;

import java.time.OffsetDateTime;
import java.util.UUID;

public class TransactionValidatedEvent {

    private UUID eventId;
    private UUID transactionExternalId;
    private String result; // "APPROVED" | "REJECTED"
    private String reason;
    private OffsetDateTime evaluatedAt;

    public UUID getEventId() {
        return eventId;
    }

    public void setEventId(UUID eventId) {
        this.eventId = eventId;
    }

    public UUID getTransactionExternalId() {
        return transactionExternalId;
    }

    public void setTransactionExternalId(UUID transactionExternalId) {
        this.transactionExternalId = transactionExternalId;
    }

    public String getResult() {
        return result;
    }

    public void setResult(String result) {
        this.result = result;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public OffsetDateTime getEvaluatedAt() {
        return evaluatedAt;
    }

    public void setEvaluatedAt(OffsetDateTime evaluatedAt) {
        this.evaluatedAt = evaluatedAt;
    }
}