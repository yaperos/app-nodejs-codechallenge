package com.yape.transactions.model;

import lombok.Getter;

@Getter
public enum TransactionType {
    WEB(1, "web"),
    MOBILE(2, "mobile"),
    ATM(3, "ATM");

    private final int id;
    private final String name;

    TransactionType(int id, String name) {
        this.id = id;
        this.name = name;
    }

    public static TransactionType fromId(int id) {
        for (TransactionType type : values()) {
            if (type.id == id) return type;
        }
        throw new IllegalArgumentException("Invalid Transfer Type ID: " + id);
    }
}
