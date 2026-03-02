package com.yape.transaction.domain.model;

import java.util.Arrays;

public enum TransactionType {
    TRANSFER(1, "Transfer"),
    PAYMENT(2, "Payment"),
    WITHDRAWAL(3, "Withdrawal");

    private final Integer id;
    private final String name;

    TransactionType(Integer id, String name) {
        this.id = id;
        this.name = name;
    }

    public static TransactionType fromId(Integer id) {
        return Arrays.stream(values())
                .filter(t -> t.id.equals(id))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Unknown transfer type id: " + id));
    }

    public Integer getId() { return id; }
    public String getName() { return name; }
}
