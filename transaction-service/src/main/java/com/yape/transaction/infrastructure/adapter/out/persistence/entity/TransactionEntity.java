package com.yape.transaction.infrastructure.adapter.out.persistence.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "transactions", indexes = {
        @Index(name = "idx_transaction_external_id", columnList = "transaction_external_id")
})
public class TransactionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "transaction_external_id", nullable = false, unique = true)
    private UUID transactionExternalId;

    @Column(name = "account_external_id_debit", nullable = false)
    private UUID accountExternalIdDebit;

    @Column(name = "account_external_id_credit", nullable = false)
    private UUID accountExternalIdCredit;

    @Column(name = "transaction_type", nullable = false)
    private String transactionType;

    @Column(name = "transaction_type_id", nullable = false)
    private Integer transactionTypeId;

    @Column(name = "transaction_status", nullable = false)
    private String transactionStatus;

    @Column(name = "value", nullable = false, precision = 19, scale = 4)
    private BigDecimal value;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public UUID getTransactionExternalId() { return transactionExternalId; }
    public void setTransactionExternalId(UUID transactionExternalId) { this.transactionExternalId = transactionExternalId; }
    public UUID getAccountExternalIdDebit() { return accountExternalIdDebit; }
    public void setAccountExternalIdDebit(UUID accountExternalIdDebit) { this.accountExternalIdDebit = accountExternalIdDebit; }
    public UUID getAccountExternalIdCredit() { return accountExternalIdCredit; }
    public void setAccountExternalIdCredit(UUID accountExternalIdCredit) { this.accountExternalIdCredit = accountExternalIdCredit; }
    public String getTransactionType() { return transactionType; }
    public void setTransactionType(String transactionType) { this.transactionType = transactionType; }
    public Integer getTransactionTypeId() { return transactionTypeId; }
    public void setTransactionTypeId(Integer transactionTypeId) { this.transactionTypeId = transactionTypeId; }
    public String getTransactionStatus() { return transactionStatus; }
    public void setTransactionStatus(String transactionStatus) { this.transactionStatus = transactionStatus; }
    public BigDecimal getValue() { return value; }
    public void setValue(BigDecimal value) { this.value = value; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
