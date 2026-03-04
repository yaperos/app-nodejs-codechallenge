package com.yape.shared.domain;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum TransactionStatus {
    PENDING,
    APPROVED,
    REJECTED;

    @JsonCreator
    public static TransactionStatus fromString(String key) {
        for (TransactionStatus type : TransactionStatus.values()) {
            if (type.name().equalsIgnoreCase(key)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Unknown TransactionStatus: " + key);
    }

    @JsonValue
    public String toValue() {
        return this.name();
    }
}
