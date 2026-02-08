package com.yaperos.codechallenge.transaction.domain.model;

import com.yaperos.codechallenge.transaction.domain.exception.InvalidTransferTypeException;
import lombok.Getter;

@Getter
public enum TransferType {

    EXTERNAL(1, "External");

    private final int id;
    private final String name;

    TransferType(int id, String name) {
        this.id = id;
        this.name = name;
    }

    public static TransferType fromId(int id) {
        for (TransferType type : values()) {
            if (type.id == id) {
                return type;
            }
        }
        throw new InvalidTransferTypeException(id);
    }

}
