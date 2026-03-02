package com.yape.antifraud.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Pure domain entity representing an evaluated transaction.
 * No JPA or infrastructure annotations - this belongs to the domain layer.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EvaluatedTransaction {

    private UUID transactionId;
    private String status;
    private LocalDateTime evaluatedAt;
}
