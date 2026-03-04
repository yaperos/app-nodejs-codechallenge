package com.yape.shared.domain;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum TransactionType {
    PENDING,
    APPROVED,
    REJECTED;

    @JsonCreator
    public static TransactionType fromString(String key) {
        for (TransactionType type : TransactionType.values()) {
            if (type.name().equalsIgnoreCase(key)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Unknown TransactionType: " + key);
    }

    @JsonValue
    public String toValue() {
        return this.name();
    }
}
