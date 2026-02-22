package com.yape.transaction.domain.model;

import java.util.Arrays;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

public enum TransactionStatus {
    PENDING("pending"),
    APPROVED("approved"),
    REJECTED("rejected");

    private static final Map<String, TransactionStatus> BY_VALUE = Arrays.stream(values())
            .collect(Collectors.toMap(status -> status.value.toLowerCase(), Function.identity()));

    private final String value;

    TransactionStatus(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    public static TransactionStatus fromString(String status) {
        var result = BY_VALUE.get(status.toLowerCase());
        if (result == null) {
            throw new IllegalArgumentException("Unknown transaction status: " + status);
        }
        return result;
    }
}
