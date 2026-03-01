package com.retotecnico.transaction.domain.model;

public enum TransferType {
    TRANSFER(1, "Transfer"),
    PAYMENT(2, "Payment"),
    DEPOSIT(3, "Deposit");

    private final int id;
    private final String name;

    TransferType(int id, String name) {
        this.id = id;
        this.name = name;
    }

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public static TransferType fromId(int id) {
        for (TransferType type : values()) {
            if (type.id == id) {
                return type;
            }
        }
        throw new IllegalArgumentException("Invalid transfer type id: " + id);
    }
}
