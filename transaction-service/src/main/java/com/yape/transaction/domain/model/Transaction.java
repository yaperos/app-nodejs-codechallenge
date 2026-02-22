package com.yape.transaction.domain.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public class Transaction {

    private UUID id;
    private UUID accountExternalIdDebit;
    private UUID accountExternalIdCredit;
    private Integer transferTypeId;
    private BigDecimal value;
    private TransactionStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private Transaction() {}

    public static Transaction create(
            UUID accountExternalIdDebit,
            UUID accountExternalIdCredit,
            Integer transferTypeId,
            BigDecimal value
    ) {
        if (accountExternalIdDebit == null || accountExternalIdCredit == null) {
            throw new IllegalArgumentException("Debit and credit accounts must not be null");
        }
        if (transferTypeId == null || value == null) {
            throw new IllegalArgumentException("Transfer type and value must not be null");
        }
        if (accountExternalIdDebit.equals(accountExternalIdCredit)) {
            throw new IllegalArgumentException("Debit and credit accounts must be different");
        }
        var transaction = new Transaction();
        transaction.id = UUID.randomUUID();
        transaction.accountExternalIdDebit = accountExternalIdDebit;
        transaction.accountExternalIdCredit = accountExternalIdCredit;
        transaction.transferTypeId = transferTypeId;
        transaction.value = value;
        transaction.status = TransactionStatus.PENDING;
        transaction.createdAt = LocalDateTime.now();
        return transaction;
    }

    public static Transaction reconstitute(
            UUID id,
            UUID accountExternalIdDebit,
            UUID accountExternalIdCredit,
            Integer transferTypeId,
            BigDecimal value,
            TransactionStatus status,
            LocalDateTime createdAt,
            LocalDateTime updatedAt
    ) {
        var transaction = new Transaction();
        transaction.id = id;
        transaction.accountExternalIdDebit = accountExternalIdDebit;
        transaction.accountExternalIdCredit = accountExternalIdCredit;
        transaction.transferTypeId = transferTypeId;
        transaction.value = value;
        transaction.status = status;
        transaction.createdAt = createdAt;
        transaction.updatedAt = updatedAt;
        return transaction;
    }

    public void approve() {
        if (this.status != TransactionStatus.PENDING) {
            throw new IllegalStateException(
                "Cannot approve transaction with status: " + this.status
            );
        }
        this.status = TransactionStatus.APPROVED;
        this.updatedAt = LocalDateTime.now();
    }

    public void reject() {
        if (this.status != TransactionStatus.PENDING) {
            throw new IllegalStateException(
                "Cannot reject transaction with status: " + this.status
            );
        }
        this.status = TransactionStatus.REJECTED;
        this.updatedAt = LocalDateTime.now();
    }

    public boolean isPending() {
        return this.status == TransactionStatus.PENDING;
    }

    public UUID getId() { return id; }
    public UUID getAccountExternalIdDebit() { return accountExternalIdDebit; }
    public UUID getAccountExternalIdCredit() { return accountExternalIdCredit; }
    public Integer getTransferTypeId() { return transferTypeId; }
    public BigDecimal getValue() { return value; }
    public TransactionStatus getStatus() { return status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    public String getTransferTypeName() {
        return TransferType.fromId(this.transferTypeId).getName();
    }
}
