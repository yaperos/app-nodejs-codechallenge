package com.yape.transaction.domain.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public class Transaction {

    private UUID transactionExternalId;
    private UUID accountExternalIdDebit;
    private UUID accountExternalIdCredit;
    private Integer transferTypeId;
    private BigDecimal value;
    private TransactionStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Transaction() {
        this.transactionExternalId = UUID.randomUUID();
        this.status = TransactionStatus.PENDING;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public Transaction(UUID accountExternalIdDebit, UUID accountExternalIdCredit, 
                      Integer transferTypeId, BigDecimal value) {
        this();
        this.accountExternalIdDebit = accountExternalIdDebit;
        this.accountExternalIdCredit = accountExternalIdCredit;
        this.transferTypeId = transferTypeId;
        this.value = value;
    }

    // Getters and Setters
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

    public Integer getTransferTypeId() {
        return transferTypeId;
    }

    public void setTransferTypeId(Integer transferTypeId) {
        this.transferTypeId = transferTypeId;
    }

    public BigDecimal getValue() {
        return value;
    }

    public void setValue(BigDecimal value) {
        this.value = value;
    }

    public TransactionStatus getStatus() {
        return status;
    }

    public void setStatus(TransactionStatus status) {
        this.status = status;
        this.updatedAt = LocalDateTime.now();
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public void approve() {
        this.status = TransactionStatus.APPROVED;
        this.updatedAt = LocalDateTime.now();
    }

    public void reject() {
        this.status = TransactionStatus.REJECTED;
        this.updatedAt = LocalDateTime.now();
    }

    public boolean isPending() {
        return this.status == TransactionStatus.PENDING;
    }
}
