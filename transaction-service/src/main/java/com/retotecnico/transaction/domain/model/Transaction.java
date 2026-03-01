package com.retotecnico.transaction.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Entidad de dominio - objeto de negocio puro, sin dependencias de frameworks.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Transaction {

    private UUID transactionExternalId;
    private UUID accountExternalIdDebit;
    private UUID accountExternalIdCredit;
    private TransferType transferType;
    private BigDecimal value;
    private TransactionStatus status;
    private LocalDateTime createdAt;

    /**
     * Metodo de fabrica para crear una nueva transaccion con estado pendiente.
     */
    public static Transaction create(UUID accountExternalIdDebit,
                                     UUID accountExternalIdCredit,
                                     int transferTypeId,
                                     BigDecimal value) {
        return Transaction.builder()
                .transactionExternalId(UUID.randomUUID())
                .accountExternalIdDebit(accountExternalIdDebit)
                .accountExternalIdCredit(accountExternalIdCredit)
                .transferType(TransferType.fromId(transferTypeId))
                .value(value)
                .status(TransactionStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .build();
    }

    public void approve() {
        this.status = TransactionStatus.APPROVED;
    }

    public void reject() {
        this.status = TransactionStatus.REJECTED;
    }
}
