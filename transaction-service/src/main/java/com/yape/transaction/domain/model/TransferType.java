package com.yape.transaction.domain.model;

public enum TransferType {
    TRANSFER(1, "Transfer"),
    PAYMENT(2, "Payment"),
    DEPOSIT(3, "Deposit"),
    WITHDRAWAL(4, "Withdrawal");

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
        for (TransferType type : TransferType.values()) {
            if (type.id == id) {
                return type;
            }
        }
        throw new IllegalArgumentException("Unknown transfer type id: " + id);
    }

    public static String getNameById(int id) {
        return fromId(id).getName();
    }
}
