package com.yape.payment.transaction.api.dto;

public class TransactionTypeDto {

    private String name;

    public TransactionTypeDto() {
    }

    public TransactionTypeDto(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}