package com.yape.transactions.model;

import lombok.Getter;

@Getter
public enum TransactionStatus {
    PENDING("pending"),
    APPROVED("approved"),
    REJECTED("rejected");

    private final String name;

    TransactionStatus(String name) {
        this.name = name;
    }
}
