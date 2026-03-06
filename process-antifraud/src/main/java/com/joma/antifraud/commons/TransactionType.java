package com.joma.antifraud.commons;

import java.util.Map;

public enum TransactionType {
    TRANSFERENCIA(1),
    PAGOS(2),
    COMPRAS(3),
    OTROS(4);

    private final int code;

    TransactionType(int code) {
        this.code = code;
    }

    public int getCode() {
        return code;
    }

    private static final Map<Integer, TransactionType> BY_CODE =
            Map.of(1, TRANSFERENCIA, 2, PAGOS, 3, COMPRAS, 4, OTROS);

    public static TransactionType fromCode(int code) {
        TransactionType status = BY_CODE.get(code);
        if (status == null) {
            throw new IllegalArgumentException("TypeCode Invalido: " + code);
        }
        return status;
    }
}
