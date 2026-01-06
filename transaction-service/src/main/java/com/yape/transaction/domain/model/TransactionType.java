package com.yape.transaction.domain.model;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * Enum de tipos de transacción
 */
@Getter
@AllArgsConstructor
public enum TransactionType {
    TRANSFER(1, "transfer"),
    DEPOSIT(2, "deposit"),
    WITHDRAWAL(3, "withdrawal");

    private final int id;
    private final String name;

    public static TransactionType fromId(int id) {
        for (TransactionType type : values()) {
            if (type.id == id) {
                return type;
            }
        }
        throw new IllegalArgumentException("Invalid transaction type id: " + id);
    }

    public static TransactionType fromName(String name) {
        for (TransactionType type : values()) {
            if (type.name.equalsIgnoreCase(name)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Invalid transaction type: " + name);
    }
}

