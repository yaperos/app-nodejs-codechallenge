package com.retotecnico.transaction.infrastructure.adapter.out.persistence;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * JPA entity - infrastructure concern, maps to database table.
 */
@Entity
@Table(name = "transactions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionJpaEntity {

    @Id
    @Column(name = "transaction_external_id", nullable = false, updatable = false)
    private UUID transactionExternalId;

    @Column(name = "account_external_id_debit", nullable = false)
    private UUID accountExternalIdDebit;

    @Column(name = "account_external_id_credit", nullable = false)
    private UUID accountExternalIdCredit;

    @Column(name = "transfer_type_id", nullable = false)
    private int transferTypeId;

    @Column(name = "value", nullable = false, precision = 19, scale = 2)
    private BigDecimal value;

    @Column(name = "status", nullable = false, length = 20)
    private String status;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
}
