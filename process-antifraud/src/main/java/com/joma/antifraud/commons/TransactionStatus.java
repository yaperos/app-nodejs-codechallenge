package com.joma.antifraud.commons;

import java.util.Map;

public enum TransactionStatus {
    APROBADO(1),
    PENDIENTE(2),
    RECHAZADO(3);

    private final int code;

    TransactionStatus(int code) {
        this.code = code;
    }

    public int getCode() {
        return code;
    }

    private static final Map<Integer, TransactionStatus> BY_CODE =
            Map.of(1, APROBADO, 2, PENDIENTE, 3, RECHAZADO);

    public static TransactionStatus fromCode(int code) {
        TransactionStatus type = BY_CODE.get(code);
        if (type == null) {
            throw new IllegalArgumentException("StatusCode invalido: " + code);
        }
        return type;
    }
}
