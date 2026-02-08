package com.yaperos.codechallenge.transaction.domain.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Transaction implements java.io.Serializable {

    private UUID transactionExternalId;
    private UUID accountExternalIdDebit;
    private UUID accountExternalIdCredit;
    private TransferType transferType;
    private BigDecimal value;
    private TransactionStatus status;
    private LocalDateTime createdAt;

    public static Transaction create(UUID accountExternalIdDebit,
                                     UUID accountExternalIdCredit,
                                     TransferType transferType,
                                     BigDecimal value) {
        return new Transaction(
                UUID.randomUUID(),
                accountExternalIdDebit,
                accountExternalIdCredit,
                transferType,
                value,
                TransactionStatus.PENDING,
                LocalDateTime.now()
        );
    }

    public void approve() {
        if (this.status == TransactionStatus.APPROVED) return;
        if (this.status != TransactionStatus.PENDING) {
            throw new IllegalStateException("Transaction can only be approved from PENDING status");
        }
        this.status = TransactionStatus.APPROVED;
    }

    public void reject() {
        if (this.status == TransactionStatus.REJECTED) return;
        if (this.status != TransactionStatus.PENDING) {
            throw new IllegalStateException("Transaction can only be rejected from PENDING status");
        }
        this.status = TransactionStatus.REJECTED;
    }

}
