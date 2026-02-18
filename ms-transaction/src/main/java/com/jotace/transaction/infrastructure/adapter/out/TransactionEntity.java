package com.jotace.transaction.infrastructure.adapter.out;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "transaction")
public class TransactionEntity {

    @Id
    @Column(name = "transaction_external_id", unique = true, nullable = false)
    private UUID transactionExternalId;

    @Column(name = "account_external_id_debit", nullable = false)
    private String accountExternalIdDebit;

    @Column(name = "account_external_id_credit", nullable = false)
    private String accountExternalIdCredit;

    @Column(name = "transfer_type_id", nullable = false)
    private int tranferTypeId;

    @Column(name = "value", nullable = false)
    private double value;

    @Column(name = "transaction_status", nullable = false)
    private String transactionStatus;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    public TransactionEntity() {
    }

    // Constructor used by the adapter to save a new record
    public TransactionEntity(UUID transactionExternalId, String accountExternalIdDebit, String accountExternalIdCredit, int tranferTypeId, double value, String transactionStatus, Instant createdAt) {
        this.transactionExternalId = transactionExternalId;
        this.accountExternalIdDebit = accountExternalIdDebit;
        this.accountExternalIdCredit = accountExternalIdCredit;
        this.tranferTypeId = tranferTypeId;
        this.value = value;
        this.transactionStatus = transactionStatus;
        this.createdAt = createdAt;
    }

    public UUID getTransactionExternalId() { return transactionExternalId; }
    public void setTransactionExternalId(UUID transactionExternalId) { this.transactionExternalId = transactionExternalId; }
    public String getAccountExternalIdDebit() { return accountExternalIdDebit; }
    public void setAccountExternalIdDebit(String accountExternalIdDebit) { this.accountExternalIdDebit = accountExternalIdDebit; }
    public String getAccountExternalIdCredit() { return accountExternalIdCredit; }
    public void setAccountExternalIdCredit(String accountExternalIdCredit) { this.accountExternalIdCredit = accountExternalIdCredit; }
    public int getTransferTypeId() { return tranferTypeId; }
    public void setTransferTypeId(int tranferTypeId) { this.tranferTypeId = tranferTypeId; }
    public double getValue() { return value; }
    public void setValue(double value) { this.value = value; }
    public String getTransactionStatus() { return transactionStatus; }
    public void setTransactionStatus(String transactionStatus) { this.transactionStatus = transactionStatus; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
