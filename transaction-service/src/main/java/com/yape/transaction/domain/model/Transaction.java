package com.yape.transaction.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Entidad de dominio Transaction - Modelo rico con lógica de negocio
 */
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Transaction {

    private Long id;
    private UUID transactionExternalId;
    private UUID accountExternalIdDebit;
    private UUID accountExternalIdCredit;
    private TransactionType transactionType;
    private TransactionStatus transactionStatus;
    private BigDecimal value;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long version;

    /**
     * Crea una nueva transacción en estado PENDING
     */
    public static Transaction createPending(
            UUID accountExternalIdDebit,
            UUID accountExternalIdCredit,
            TransactionType transactionType,
            BigDecimal value) {

        return Transaction.builder()
                .transactionExternalId(UUID.randomUUID())
                .accountExternalIdDebit(accountExternalIdDebit)
                .accountExternalIdCredit(accountExternalIdCredit)
                .transactionType(transactionType)
                .transactionStatus(TransactionStatus.PENDING)
                .value(value)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .version(0L)
                .build();
    }

    /**
     * Actualiza el estado de la transacción
     */
    public void updateStatus(TransactionStatus newStatus) {
        this.transactionStatus = newStatus;
        this.updatedAt = LocalDateTime.now();
    }

    /**
     * Verifica si la transacción está pendiente
     */
    public boolean isPending() {
        return TransactionStatus.PENDING.equals(this.transactionStatus);
    }

    /**
     * Verifica si la transacción está aprobada
     */
    public boolean isApproved() {
        return TransactionStatus.APPROVED.equals(this.transactionStatus);
    }

    /**
     * Verifica si la transacción está rechazada
     */
    public boolean isRejected() {
        return TransactionStatus.REJECTED.equals(this.transactionStatus);
    }
}

