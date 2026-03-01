package com.yape.transactionservice.domain.enums;

import lombok.Getter;

@Getter
public enum TransferType {
    INTERNAL(1, "Internal Transfer"),
    EXTERNAL(2, "External Transfer");

    private final Integer id;
    private final String name;

    TransferType(Integer id, String name) {
        this.id = id;
        this.name = name;
    }

    public static TransferType getById(Integer id) {
        for (TransferType type : values()) {
            if (type.id.equals(id)) return type;
        }
        throw new IllegalArgumentException("TransferType not found: " + id);
    }

    public static String getNameById(Integer id) {
        for (TransferType type : values()) {
            if (type.id.equals(id)) return type.name;
        }
        throw new IllegalArgumentException("TransferType not found: " + id);
    }


}
