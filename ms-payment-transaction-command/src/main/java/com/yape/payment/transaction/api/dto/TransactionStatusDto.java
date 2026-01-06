package com.yape.payment.transaction.api.dto;

public class TransactionStatusDto {

    private String name;

    public TransactionStatusDto() {
    }

    public TransactionStatusDto(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
