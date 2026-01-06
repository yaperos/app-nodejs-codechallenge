package com.yape.transaction.domain.model;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * Enum de estados de transacción
 */
@Getter
@AllArgsConstructor
public enum TransactionStatus {
    PENDING("pending"),
    APPROVED("approved"),
    REJECTED("rejected");

    private final String name;

    public static TransactionStatus fromName(String name) {
        for (TransactionStatus status : values()) {
            if (status.name.equalsIgnoreCase(name)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Invalid transaction status: " + name);
    }
}

