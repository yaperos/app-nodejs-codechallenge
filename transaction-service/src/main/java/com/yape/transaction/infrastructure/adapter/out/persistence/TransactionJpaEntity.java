package com.yape.transaction.infrastructure.adapter.out.persistence;

import com.yape.transaction.domain.model.TransactionStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "transactions")
public class TransactionJpaEntity {

    @Id
    private UUID id;

    @Column(name = "account_external_id_debit", nullable = false)
    private UUID accountExternalIdDebit;

    @Column(name = "account_external_id_credit", nullable = false)
    private UUID accountExternalIdCredit;

    @Column(name = "transfer_type_id", nullable = false)
    private Integer transferTypeId;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal value;

    @Column(nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private TransactionStatus status;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    protected TransactionJpaEntity() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getAccountExternalIdDebit() { return accountExternalIdDebit; }
    public void setAccountExternalIdDebit(UUID accountExternalIdDebit) { this.accountExternalIdDebit = accountExternalIdDebit; }
    public UUID getAccountExternalIdCredit() { return accountExternalIdCredit; }
    public void setAccountExternalIdCredit(UUID accountExternalIdCredit) { this.accountExternalIdCredit = accountExternalIdCredit; }
    public Integer getTransferTypeId() { return transferTypeId; }
    public void setTransferTypeId(Integer transferTypeId) { this.transferTypeId = transferTypeId; }
    public BigDecimal getValue() { return value; }
    public void setValue(BigDecimal value) { this.value = value; }
    public TransactionStatus getStatus() { return status; }
    public void setStatus(TransactionStatus status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
