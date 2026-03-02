package com.yape.transaction.domain.model;

/**
 * Enum representing the possible states of a transaction.
 */
public enum TransactionStatus {
    PENDING("pending"),
    APPROVED("approved"),
    REJECTED("rejected");

    private final String name;

    TransactionStatus(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public static TransactionStatus fromString(String status) {
        for (TransactionStatus s : TransactionStatus.values()) {
            if (s.name.equalsIgnoreCase(status) || s.name().equalsIgnoreCase(status)) {
                return s;
            }
        }
        throw new IllegalArgumentException("Unknown status: " + status);
    }
}
