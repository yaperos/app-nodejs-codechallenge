package com.yape.antifraud.infrastructure.persistence.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * JPA entity mapped to the "evaluated_transactions" table.
 * This is an infrastructure concern and should not leak into the domain layer.
 */
@Entity
@Table(name = "evaluated_transactions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EvaluatedTransactionEntity {

    @Id
    @Column(name = "transaction_id", nullable = false, updatable = false)
    private UUID transactionId;

    @Column(name = "status", nullable = false, length = 20)
    private String status;

    @Column(name = "evaluated_at", nullable = false)
    private LocalDateTime evaluatedAt;
}
