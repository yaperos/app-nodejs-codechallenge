package com.yape.antifraud.domain.enums;

import lombok.Getter;

@Getter
public enum TransactionStatus {
    REJECTED("REJECTED"),
    APPROVED("APPROVED");

    private final String value;

    TransactionStatus(String value) {
        this.value = value;
    }
}
