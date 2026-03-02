package com.yape.transaction.domain.enums;

import lombok.Getter;

@Getter
public enum TransactionStatus {
    PENDING("PENDING");

    private final String value;

    TransactionStatus(String value) {
        this.value = value;
    }
}
