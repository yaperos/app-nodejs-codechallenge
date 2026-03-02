package com.yape.transaction.domain.enums;

import lombok.Getter;

@Getter
public enum TransactionType {
    DEPOSIT(1),
    WITHDRAWAL(2);

    private final int value;

    TransactionType(int value) {
        this.value = value;
    }

}
