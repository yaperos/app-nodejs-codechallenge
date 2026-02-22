package com.yape.transaction.domain.model;

import java.util.Arrays;
import java.util.Map;
import java.util.stream.Collectors;

public enum TransferType {
    TRANSFER(1, "transfer");

    private static final Map<Integer, TransferType> BY_ID = Arrays.stream(values())
            .collect(Collectors.toMap(TransferType::getId, type -> type));

    private final int id;
    private final String name;

    TransferType(int id, String name) {
        this.id = id;
        this.name = name;
    }

    public int getId() { return id; }
    public String getName() { return name; }

    public static TransferType fromId(int id) {
        TransferType type = BY_ID.get(id);
        if (type == null) {
            throw new IllegalArgumentException("Unknown transfer type ID: " + id);
        }
        return type;
    }
}
