package com.yape.transaction.infrastructure.adapter.in.messaging;

import java.util.UUID;

public class TransactionStatusEvent {

    private UUID transactionExternalId;
    private String status;

    public TransactionStatusEvent() {
    }

    public TransactionStatusEvent(UUID transactionExternalId, String status) {
        this.transactionExternalId = transactionExternalId;
        this.status = status;
    }

    public UUID getTransactionExternalId() {
        return transactionExternalId;
    }

    public void setTransactionExternalId(UUID transactionExternalId) {
        this.transactionExternalId = transactionExternalId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
