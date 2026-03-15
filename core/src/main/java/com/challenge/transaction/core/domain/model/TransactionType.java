package com.challenge.transaction.core.domain.model;

import lombok.Getter;

@Getter
public enum TransactionType {

    TRANSFER(1);

    private final int id;

    TransactionType(int id) {
        this.id = id;
    }

    public static TransactionType fromId(int id) {

        for (TransactionType type : values()) {
            if (type.id == id) {
                return type;
            }
        }

        throw new IllegalArgumentException("Tipo de transaccion no registrada");
    }

}
