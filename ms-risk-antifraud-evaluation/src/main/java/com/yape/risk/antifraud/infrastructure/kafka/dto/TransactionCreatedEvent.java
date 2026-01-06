package com.yape.risk.antifraud.infrastructure.kafka.dto;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

public class TransactionCreatedEvent {

    private UUID eventId;
    private UUID transactionExternalId;
    private UUID accountExternalIdDebit;
    private UUID accountExternalIdCredit;
    private Integer tranferTypeId;
    private BigDecimal value;
    private OffsetDateTime createdAt;

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

    public UUID getAccountExternalIdDebit() {
        return accountExternalIdDebit;
    }

    public void setAccountExternalIdDebit(UUID accountExternalIdDebit) {
        this.accountExternalIdDebit = accountExternalIdDebit;
    }

    public UUID getAccountExternalIdCredit() {
        return accountExternalIdCredit;
    }

    public void setAccountExternalIdCredit(UUID accountExternalIdCredit) {
        this.accountExternalIdCredit = accountExternalIdCredit;
    }

    public Integer getTranferTypeId() {
        return tranferTypeId;
    }

    public void setTranferTypeId(Integer tranferTypeId) {
        this.tranferTypeId = tranferTypeId;
    }

    public BigDecimal getValue() {
        return value;
    }

    public void setValue(BigDecimal value) {
        this.value = value;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
