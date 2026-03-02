package com.yape.transaction_service.enums;

public enum TransactionStatusEnum {
    PENDING(1),
    APPROVED(2),
    REJECTED(3);

    private final int code;

    TransactionStatusEnum(int code) {
        this.code = code;
    }

    public int getCode() {
        return code;
    }
}