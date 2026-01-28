package com.yape.transactionservice.entity;

import lombok.Getter;

@Getter
public enum TransactionType {
    TRANSFER(1, "Transfer"),
    PAYMENT(2, "Payment"),
    WITHDRAWAL(3, "Withdrawal");

    private final int id;
    private final String name;

    TransactionType(int id, String name) {
        this.id = id;
        this.name = name;
    }

    public static TransactionType fromId(int id) {
        for (TransactionType type : values()) {
            if (type.getId() == id) {
                return type;
            }
        }
        throw new IllegalArgumentException("Invalid transaction type id: " + id);
    }
}
